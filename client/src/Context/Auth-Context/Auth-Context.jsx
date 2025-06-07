import { createContext, useState, useEffect, useContext, useRef } from "react";

const authChecking = import.meta.env.VITE_API_AUTHCHECK;
const loginApi = import.meta.env.VITE_API_LOGIN;
const userInfo = import.meta.env.VITE_API_USERINFO;
const logoutApi = import.meta.env.VITE_API_LOGOUT;
const forgotPw = import.meta.env.VITE_API_FORGOTPW;
const verifyOtp = import.meta.env.VITE_API_VERIFYOTP;
const resetUserPw = import.meta.env.VITE_API_RESETUPW;
const guestUserApi = import.meta.env.VITE_API_GUESTUSER;
const GUEST_USER = import.meta.env.VITE_GUEST_USER;
const GUEST_PASSWORD = import.meta.env.VITE_GUEST_PASSWORD;

import axios from "axios";

axios.defaults.withCredentials = true;

export const AuthContext = createContext();

export const GetAuthenticationProvider = ({ children }) => {
  const [isAuthStatus, setIsAuthStatus] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  const isUserAuthenticated = async () => {
    try {
      const response = await axios.get(authChecking);

      setIsAuthStatus({
        loggedIn: response.data.loggedIn,
        isVerified: response.data.isVerified,
        verificationToken: response.data.verificationToken,
        isGuest: response.data.isGuest,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const loginUser = async (loginData) => {
    await axios.post(loginApi, loginData);
    const res = await axios.get(authChecking);
    setIsAuthStatus(res.data);
    return res.data.loggedIn;
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data } = await axios.get(userInfo);
        setUserProfile(data);
      } catch (err) {
        console.error("fetching userdata Error:", err);
      }
    };

    if (isAuthStatus?.loggedIn) {
      fetchUserData();
    }
  }, [isAuthStatus?.loggedIn]);

  const loginGuestUser = async () => {
    try {
      const loginGuestData = {
        email: GUEST_USER,
        password: GUEST_PASSWORD,
      };
      await axios.post(guestUserApi, loginGuestData);
      const res = await axios.get(authChecking);
      setIsAuthStatus(res.data);
      return res.data.loggedIn;
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 409) {
        throw 409;
      }
      throw 500;
    }
  };

  const logoutUser = async () => {
    await axios.post(logoutApi);
    const res = await axios.get(authChecking);
    setIsAuthStatus(res.data);
    return res.data.loggedIn === false;
  };

  const forgotUserPw = async (resetData) => {
    await axios.post(forgotPw, resetData);
    const res = await axios.get(authChecking);
    setIsAuthStatus(res.data);
    return res.data.otpSent;
  };

  const authenticateOtp = async (otpData) => {
    const otp = await axios.post(verifyOtp, otpData);
    return otp;
  };

  const changeUserPw = async (newPwData) => {
    const newPw = await axios.post(resetUserPw, newPwData);
    return newPw;
  };

  useEffect(() => {
    isUserAuthenticated();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthStatus,
        loginUser,
        userProfile,
        logoutUser,
        forgotUserPw,
        authenticateOtp,
        changeUserPw,
        loginGuestUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// verwendung von useAuth() statt isAuthStatus, loginUser, logoutUser
// immer wieder über den Context in jeder file zu ziehen
export const useAuth = () => useContext(AuthContext);
