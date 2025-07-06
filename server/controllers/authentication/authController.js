const User = require("../../models/userSchema");
// const nodemailer = require("nodemailer");
const crypto = require("crypto");
// const bcrypt = require("bcrypt");
const passport = require("passport");

// const EMAIL_USER = process.env.EMAIL_USER;
// const EMAIL_PASS = process.env.EMAIL_PASS;
const FRONTEND_URL = process.env.FRONTEND_URL;

exports.logout = async (req, res) => {
  try {
    const userSession = req.session?.user;
    const userId = req.user?._id || req.user?.id;
    if (!userSession) {
      return res
        .status(400)
        .json({ success: false, message: "No active session" });
    }

    await User.findByIdAndUpdate(userId, { isOnline: false });

    // Wenn Guest, dann Gast-Status zurücksetzen
    if (userSession.isGuest) {
      const guestUser = await User.findById(userSession.id);
      if (guestUser) {
        guestUser.isGuestLoggedIn = false;
        await guestUser.save();
      }
    }

    req.session.destroy((err) => {
      if (err) {
        return res
          .status(500)
          .json({ success: false, message: "Logout failed" });
      }
      res.clearCookie("connect.sid");
      res.status(200).json({ success: true, message: "Logout successful" });
    });
  } catch (err) {
    console.error("Error during logout:", err);
    res
      .status(500)
      .json({ success: false, message: "Server error during logout" });
  }
};

exports.getUserInfo = async (req, res) => {
  const loggedInUser = req.session.passport?.user || req.session.user;
  const userId =
    typeof loggedInUser === "object" ? loggedInUser.id : loggedInUser;
  if (!userId) return res.status(401).json({ message: "Not logged in" });

  const user = await User.findById(userId).select("name email _id avatar");
  if (!user) return res.status(404).json({ message: "User not found" });

  res.json({
    name: user.name,
    email: user.email,
    _id: user.id,
    avatar: user.avatar,
  });
};

exports.authStatus = async (req, res) => {
  const userId = req.user?._id || req.user?.id;

  if (!userId) {
    return res.status(200).json({ loggedIn: false });
  }

  try {
    const user = await User.findById(userId).select(
      "isVerified verificationToken otpSent isGuest isOnline"
    );

    if (!user) {
      return res.status(404).json({ loggedIn: false });
    }

    res.status(200).json({
      loggedIn: true,
      isOnline: user.isOnline,
      isVerified: user.isVerified,
      otpSent: user.otpSent,
      verificationToken: user.verificationToken,
      isGuest: user.isGuest,
    });
  } catch (err) {
    console.error("AuthCheck Error:", err);
    res.status(500).json({ loggedIn: false, error: "Internal Server Error" });
  }
};

exports.login = (req, res, next) => {
  passport.authenticate("local", async (err, user, info) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: "sign-in unsuccessfully" });
    }
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "wrong login-data" });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Please confirm your Email, to Sign-in.",
      });
    }

    req.logIn(user, async (err) => {
      if (err) {
        return res
          .status(500)
          .json({ success: false, message: "sign-in unsuccessfully" });
      }

      user.isOnline = true;
      await user.save();

      res.status(200).json({
        success: true,
        message: "Login successfully",

        user: {
          id: user._id,
          email: user.email,
          isGuest: false,
        },
      });
    });
  })(req, res, next);
};

exports.register = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const tokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 Stunden gültig

    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      isVerified: false,
      verificationToken,
      tokenExpires,
    });

    const saveRegistData = await newUser.save();
    const verifyLink = `${process.env.FRONTEND_URL}/verifyUser?token=${verificationToken}`;

    // E-Mail versenden
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: EMAIL_USER,
      to: req.body.email,
      subject: "E-Mail-Verification",
      text: `Please click on the current Link, to verify your E-Mail: ${verifyLink}`,
      html: `<p>Please click on the current Link, to verify your E-Mail:</p>
             <a href="${verifyLink}">${verifyLink}</a>`,
    });

    res.status(201).json({
      success: true,
      message:
        "Sign-up was successfully! Please check your inbox for the verification.",
      user: {
        id: saveRegistData.id,
        name: saveRegistData.name,
        email: saveRegistData.email,
      },
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message }); // Fehlerfall mit success: false
  }
};

exports.verifySession = async (req, res) => {
  const { token } = req.query;

  try {
    // Benutzer mit dem Token finden
    const user = await User.findOne({
      verificationToken: token,
      tokenExpires: { $gt: Date.now() }, // Token darf nicht abgelaufen sein
    });

    if (!user) {
      return res.status(400).send("Token is wrong or expired.");
    }

    // Benutzer verifizieren
    user.isVerified = true;
    user.verificationToken = null; // Token entfernen
    user.tokenExpires = null; // Ablaufdatum entfernen
    await user.save();

    res.status(200).json({
      success: true,
      message: "E-Mail verified successfully! Now you can sign-in.",
    });
  } catch (err) {
    console.error("Error with the verification:", err);
    res.status(500).send("Intern Server-Error.");
  }
};

exports.forgotPw = async (req, res) => {
  const { email } = req.body;

  // E-Mail Validierung
  const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email address." });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Email not found." });
    }

    if (user.googleId || user.githubId) {
      return res.status(400).json({
        message:
          "Your account was created using Google or GitHub. Please use that login method.",
      });
    }

    // Überprüfen, ob der Code noch nicht abgelaufen ist
    if (user.resetCodeExpires > Date.now()) {
      return res.status(400).json({
        message:
          "A reset code has already been sent. Please wait until it expires before requesting a new one.",
      });
    }

    const otpSent = Math.floor(100000 + Math.random() * 900000);

    // Reset-Code und Ablaufdatum speichern
    user.otpSent = otpSent;
    user.resetCodeExpires = Date.now() + 600000; // Code 10 Minuten gültig

    await user.save();
    // Code per E-Mail senden
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: EMAIL_USER,
      to: req.body.email,
      subject: "Password-Reset-OTP",
      text: `Your 6-digit password reset code is: ${otpSent}. This code is valid for 10 minutes.`,
    });

    res.json({ message: "Password reset code sent." });
  } catch (error) {
    console.error("Error sending the code:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.verifyOtp = async (req, res) => {
  const { email, otpSent } = req.body;

  const resetCodeInt = Number(otpSent);

  if (isNaN(resetCodeInt)) {
    return res.status(400).json({ message: "Invalid reset code." });
  }

  try {
    const user = await User.findOne({
      email,
      otpSent: resetCodeInt,
      resetCodeExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset code." });
    }

    res.status(200).json({
      message: "Code verified. You can now reset your password.",
    });
  } catch (error) {
    console.error("Error during code verification:", error);
    res.status(500).json({ message: "Server error." });
  }
};

exports.resetPw = async (req, res) => {
  const { email, otpSent, newPassword } = req.body;
  try {
    const user = await User.findOne({
      email,
      otpSent,
      resetCodeExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset code." });
    }

    // Überprüfen, ob das neue Passwort mit dem alten übereinstimmt
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({
        message: "New password must be different from the current one.",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.otpSent = null;
    user.resetCodeExpires = null;

    await user.save();

    res.json({ message: "Password successfully updated." });
  } catch (error) {
    console.error("Error while resetting the password:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.handleGoogleCallback = (req, res, next) => {
  passport.authenticate("google", (err, user, info) => {
    if (err || !user) {
      res.redirect(`${FRONTEND_URL}/login`);
    }

    req.logIn(user, (err) => {
      if (err) {
        res.redirect(`${FRONTEND_URL}/login`);
      }

      req.session.user = {
        id: user._id,
        email: user.email,
        isGuest: false,
      };

      req.session.loggedIn = true;

      return res.redirect(`${FRONTEND_URL}/dashboard`);
    });
  })(req, res, next);
};

exports.handleGithubCallback = (req, res, next) => {
  passport.authenticate("github", (err, user, info) => {
    if (err || !user) {
      return res.redirect(`${FRONTEND_URL}/login`);
    }
    req.logIn(user, (err) => {
      if (err) {
        return res.redirect(`${FRONTEND_URL}/login`);
      }

      req.session.user = {
        id: user._id,
        email: user.email,
        isGuest: false,
      };
      req.session.loggedIn = true;

      return res.redirect(`${FRONTEND_URL}/dashboard`);
    });
  })(req, res, next);
};

exports.guestUserLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const guestUser = await User.findOne({ email });

    if (!guestUser) {
      return res.status(404).json({ message: "Guest user not found" });
    }

    if (!guestUser.isGuest) {
      return res.status(403).json({ message: "This user is not a guest" });
    }

    if (guestUser.isGuestLoggedIn) {
      return res
        .status(409)
        .json({ message: "Guest account is already in use" });
    }

    req.session.user = {
      id: guestUser._id,
      email: guestUser.email,
      isGuest: true,
    };

    req.session.cookie.maxAge = 1000 * 60 * 15;

    guestUser.isGuestLoggedIn = true;
    guestUser.guestSessionExpiresAt = new Date(Date.now() + 1000 * 60 * 15);
    await guestUser.save();

    return res.status(200).json({ message: "Guest login successful" });
  } catch (err) {
    console.error("Error trying to login as Guest", err);
    return res.status(500).json({ message: "Server error during guest login" });
  }
};
