import { Navigate } from "react-router-dom";
import { useAuth } from "src/Context/Auth-Context/Auth-Context";
// import { Spinner } from "@c/Spinner/Spinner";

export const ProtectedRoute = ({ children }) => {
  const { isAuthStatus } = useAuth();

  if (isAuthStatus === null) {
    return <div>Spinner----</div>;
  }

  if (isAuthStatus.loggedIn) return children;

  return <Navigate to="/login" />;
};

export const GuestRoute = ({ children }) => {
  const { isAuthStatus } = useAuth();

  if (isAuthStatus === null) {
    return <div>Spinner----</div>;
  }

  if (isAuthStatus.loggedIn) {
    return <Navigate to="/chat" />;
  }

  return children;
};

export const VerificationRoute = ({ children }) => {
  const { isAuthStatus } = useAuth();

  if (isAuthStatus === null) {
    return <div>Spinner----</div>;
  }

  if (!isAuthStatus.isVerified && isAuthStatus.verificationToken !== false) {
    return children;
  }

  return <Navigate to="/login" />;
};

export const OtpRoute = ({ children }) => {
  const { isAuthStatus } = useAuth();

  if (isAuthStatus === null) {
    return <div>Spinner----</div>;
  }

  if (isAuthStatus.otpSent !== null) {
    return children;
  }
  return <Navigate to="/login" />;
};
