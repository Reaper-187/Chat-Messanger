const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const passport = require("passport");
// const cronJob = require("../cronJob/cronGuest");

router.get("/getUserInfo", authController.getUserInfo);

router.post("/logout", authController.logout);

router.post("/login", authController.login);

router.get("/authChecking", authController.authStatus);

router.post("/register", authController.register);

router.post("/guestUser", authController.guestUserLogin);

router.get("/verifyUser", authController.verifySession);

router.post("/forgotPw", authController.forgotPw);

router.post("/verifyOtp", authController.verifyOtp);

router.post("/resetPw", authController.resetPw);

router.get(
  "/google",
  // Leitet den User direkt zur Google-Anmeldeseite weiter und der scope bestimmt auf welche Daten ich zugreifen möchte.
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get("/google/callback", authController.handleGoogleCallback);

router.get(
  "/github",
  passport.authenticate("github", { scope: ["profile", "email"] })
);

router.get("/github/callback", authController.handleGithubCallback);

// router.get("/run-cron", cronJob.runCron);

module.exports = router;
