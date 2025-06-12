import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { getAccessToken, forgotPassword, resetPassword, sendEmailVerification, verifyEmailToken } from "../API/config";
import { registerUser } from "../API/UserApi";
import axios from 'axios';


const MODAL_VIEW = {
  SOCIAL: "SOCIAL",
  LOGIN: "LOGIN",
  SIGNUP: "SIGNUP",
  FORGOT_PASSWORD_EMAIL: "FORGOT_PASSWORD_EMAIL",
  RESET_PASSWORD: "RESET_PASSWORD",
  EMAIL_VERIFICATION: "EMAIL_VERIFICATION",
  SIGNUP_FORM: "SIGNUP_FORM"
};

export const AuthModal = ({ open, onClose }) => {
  const [view, setView] = useState(MODAL_VIEW.SOCIAL);
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Email verification state
  const [verificationEmail, setVerificationEmail] = useState("");
  const [verificationToken, setVerificationToken] = useState("");
  const [verificationError, setVerificationError] = useState("");
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Sign up state
  const [signupFirstName, setSignupFirstName] = useState("");
  const [signupLastName, setSignupLastName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupMobile, setSignupMobile] = useState("");
  const [signupError, setSignupError] = useState("");
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

  // Forgot Password state
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [forgotPasswordError, setForgotPasswordError] = useState("");
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState("");

  // Reset Password state
  const [resetPasswordToken, setResetPasswordToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [resetPasswordLoading, setResetPasswordLoading] = useState(false);
  const [resetPasswordError, setResetPasswordError] = useState("");
  const [resetPasswordSuccess, setResetPasswordSuccess] = useState("");

  // Reset view and login state whenever modal is opened
  useEffect(() => {
    if (open) {
      setView(MODAL_VIEW.SOCIAL);
      setLoginUsername("");
      setLoginPassword("");
      setLoginError("");
      setLoginLoading(false);
      setSignupFirstName("");
      setSignupLastName("");
      setSignupEmail("");
      setSignupPassword("");
      setSignupMobile("");
      setSignupError("");
      setSignupLoading(false);
      setSignupSuccess(false);

      // Reset Forgot Password states
      setForgotPasswordEmail("");
      setForgotPasswordLoading(false);
      setForgotPasswordError("");
      setForgotPasswordSuccess("");

      // Reset Reset Password states
      setResetPasswordToken("");
      setNewPassword("");
      setConfirmNewPassword("");
      setResetPasswordLoading(false);
      setResetPasswordError("");
      setResetPasswordSuccess("");

      // Reset verification states
      setVerificationEmail("");
      setVerificationToken("");
      setVerificationError("");
      setVerificationLoading(false);
      setVerificationSuccess(false);
      setResendCooldown(0);
    }
  }, [open]);

  // Cooldown timer for resend button
  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);
    const result = await getAccessToken(loginUsername, loginPassword);
    setLoginLoading(false);
    if (result.success) {
      onClose();
    } else if (result.error === "email_not_found") {
      setLoginError("Email or username not found.");
    } else if (result.error === "incorrect_password") {
      setLoginError("Incorrect password.");
    } else {
      setLoginError("Login failed. Please try again.");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setSignupError("");
    setSignupLoading(true);
    const userData = {
      firstName: signupFirstName,
      lastName: signupLastName,
      password: signupPassword,
      address: "", // You can add an address field if you want
      emailAddress: verificationEmail,
      mobileNumber: signupMobile,
      whatsappNumber: signupMobile,
      isActive: 1,
      userRoleDto: { id: 3 },
    };
    const result = await registerUser(userData);
    setSignupLoading(false);
    if (result && !result.error) {
      setSignupSuccess(true);
      setTimeout(() => {
        setView(MODAL_VIEW.LOGIN);
      }, 1200);
    } else {
      setSignupError(result.error || "Registration failed. Please try again.");
    }
  };

  // handle forgot password email submission
  const handleForgotPasswordEmail = async (e) => {
    e.preventDefault();
    setForgotPasswordError("");
    setForgotPasswordSuccess("");
    setForgotPasswordLoading(true);
    try {
      const result = await forgotPassword(forgotPasswordEmail);
      setForgotPasswordLoading(false);
      // Assuming a successful response doesn't have an errorDescription field
      if (result && !result.errorDescription) {
        setForgotPasswordSuccess("Verification code sent to your email.");
        // Automatically switch to the reset password view after a short delay
        setTimeout(() => {
          setView(MODAL_VIEW.RESET_PASSWORD);
          setForgotPasswordSuccess(""); // Clear success message on view change
        }, 1500);
      } else {
        setForgotPasswordError(result?.errorDescription || "Failed to send reset link. Please try again.");
      }
    } catch (err) {
      setForgotPasswordLoading(false);
      setForgotPasswordError("An error occurred. Please try again.");
    }
  };

  // handle reset password submission
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setResetPasswordError("");
    setResetPasswordSuccess("");

    if (newPassword !== confirmNewPassword) {
      setResetPasswordError("New password and confirm password do not match.");
      return;
    }

    setResetPasswordLoading(true);
    try {
      const result = await resetPassword(resetPasswordToken, newPassword);
      setResetPasswordLoading(false);
      if (result && !result.errorDescription) {
        setResetPasswordSuccess("Password reset successfully!");
        // Automatically switch back to the login view after a short delay
        setTimeout(() => {
          setView(MODAL_VIEW.LOGIN);
          setResetPasswordSuccess(""); // Clear success message on view change
          // Potentially clear password fields here
          setNewPassword("");
          setConfirmNewPassword("");
          setResetPasswordToken("");
        }, 1500);
      } else {
        setResetPasswordError(result?.errorDescription || "Failed to reset password. Please try again.");
      }
    } catch (err) {
      setResetPasswordLoading(false);
      setResetPasswordError("An error occurred. Please try again.");
    }
  };

  // Handle initial email submission for verification
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setVerificationError("");
    setVerificationLoading(true);

    console.log("Sending email verification request with body:", JSON.stringify({ email: verificationEmail }));

    
    try {
      const result = await sendEmailVerification(verificationEmail);
      if (result.success) {
        setView(MODAL_VIEW.EMAIL_VERIFICATION);
        setResendCooldown(30); // 30 seconds cooldown
      } else {
        setVerificationError(result.error || "Failed to send verification email");
      }
    } catch (error) {
      setVerificationError("Failed to send verification email. Please try again.");
    } finally {
      setVerificationLoading(false);
    }
  };

  
  const handleVerificationSubmit = async (e) => {
    e.preventDefault();
    try {
      setVerificationLoading(true);
      setVerificationError("");
      setVerificationSuccess(false);
    
      const response = await axios.post("http://localhost:8080/user/verifyEmailToken", {
        email: verificationEmail,
        token: verificationToken.trim()
      });
    
      console.log("Verification response:", response.data);
    
      if (response.data.status === true && response.data.errorCode === 0) {
        setVerificationSuccess(true);
        setVerificationError("");
        setTimeout(() => {
          setView(MODAL_VIEW.SIGNUP_FORM);
        }, 1000);
      } else {
        setVerificationError(response.data.errorDescription || "Invalid token.");
      }
    } catch (err) {
      console.error("Verification error caught:", err);
      console.error("Error response data:", err.response?.data);
      setVerificationError(err.response?.data?.errorDescription || "Invalid token.");
    } finally {
      setVerificationLoading(false);
    }
    
  };
  

  // Handle resend verification email
  const handleResendVerification = async () => {
    if (resendCooldown > 0) return;
    
    setVerificationError("");
    setVerificationLoading(true);
    
    try {
      const result = await sendEmailVerification(verificationEmail);
      if (result.success) {
        setResendCooldown(30); // 30 seconds cooldown
      } else {
        setVerificationError(result.error || "Failed to resend verification email");
      }
    } catch (error) {
      setVerificationError("Failed to resend verification email. Please try again.");
    } finally {
      setVerificationLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md relative p-8 z-10">
        {/* Close button */}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={onClose}
          aria-label="Close"
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Social Login View */}
        {view === MODAL_VIEW.SOCIAL && (
          <>
            <h2 className="text-2xl font-bold text-center mb-8">Welcome Back!</h2>
            <div className="space-y-4">
              <button
                onClick={() => setView(MODAL_VIEW.LOGIN)}
                className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Continue with Email
              </button>
              <p className="text-center text-sm text-gray-600">
                Don't have an account?{" "}
                <button
                  className="text-blue-600 hover:text-blue-500"
                  onClick={() => setView(MODAL_VIEW.SIGNUP)}
                >
                  Sign up
                </button>
              </p>
            </div>
          </>
        )}

        {/* Email Verification View */}
        {view === MODAL_VIEW.SIGNUP && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center">Sign Up</h2>
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={verificationEmail}
                  onChange={(e) => setVerificationEmail(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              {verificationError && (
                <p className="text-red-600 text-sm">{verificationError}</p>
              )}
              <button
                type="submit"
                disabled={verificationLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {verificationLoading ? "Sending..." : "Continue"}
              </button>
              <p className="text-center text-sm text-gray-600">
                Already have an account?{" "}
                <button
                  type="button"
                  className="text-blue-600 hover:text-blue-500"
                  onClick={() => setView(MODAL_VIEW.LOGIN)}
                >
                  Log in
                </button>
              </p>
            </form>
          </div>
        )}

        {/* Token Verification View */}
        {view === MODAL_VIEW.EMAIL_VERIFICATION && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center">Verify Your Email</h2>
            <p className="text-center text-gray-600">
              We've sent a verification code to {verificationEmail}
            </p>
            <form onSubmit={handleVerificationSubmit} className="space-y-4">
              <div>
                <label htmlFor="token" className="block text-sm font-medium text-gray-700">
                  Verification Code
                </label>
                <input
                  type="text"
                  id="token"
                  value={verificationToken}
                  onChange={(e) => setVerificationToken(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              {verificationError && (
                <p className="text-red-600 text-sm">{verificationError}</p>
              )}
              {verificationSuccess && (
                <p className="text-green-600 text-sm">Email verified successfully!</p>
              )}
              <button
                type="submit"
                disabled={verificationLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {verificationLoading ? "Verifying..." : "Verify Code"}
              </button>
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendVerification}
                  disabled={resendCooldown > 0 || verificationLoading}
                  className="text-sm text-blue-600 hover:text-blue-500 disabled:text-gray-400"
                >
                  {resendCooldown > 0
                    ? `Resend code in ${resendCooldown}s`
                    : "Resend code"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Login View */}
        {view === MODAL_VIEW.LOGIN && (
          <>
            <h2 className="text-2xl font-semibold text-center mb-6">Log in</h2>
            <form className="space-y-4" onSubmit={handleLogin}>
              <div>
                <label className="block text-gray-700 mb-1">Username</label>
                <input type="text" value={loginUsername} onChange={e => setLoginUsername(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1E90FF]" placeholder="Username" />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Password</label>
                <input type="password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1E90FF]" placeholder="Password" />
              </div>
              {loginError && <div className="text-red-500 text-sm text-center">{loginError}</div>}
              <button type="submit" className="w-full bg-[#1E90FF] text-white py-2 rounded-md hover:bg-[#1876cc] transition" disabled={loginLoading}>{loginLoading ? "Logging in..." : "Log in"}</button>
            </form>
            <div className="text-center mt-4">
              <button className="text-[#1E90FF] hover:underline text-sm" onClick={() => setView(MODAL_VIEW.FORGOT_PASSWORD_EMAIL)}>Forgot your password?</button>
            </div>
            <div className="text-center text-gray-500 text-sm mt-4">
              Don&apos;t have an account?{' '}
              <button className="text-[#1E90FF] hover:underline" onClick={() => setView(MODAL_VIEW.SIGNUP)}>Register with email</button>
            </div>
          </>
        )}

        {/* Sign Up Form View */}
        {view === MODAL_VIEW.SIGNUP_FORM && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center">Complete Your Profile</h2>
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    value={signupFirstName}
                    onChange={(e) => setSignupFirstName(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    value={signupLastName}
                    onChange={(e) => setSignupLastName(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="signupEmail" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  id="signupEmail"
                  name="email" 
                  value={verificationEmail}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100 cursor-not-allowed"
                  readOnly 
                />
              </div>
              <div>
                <label htmlFor="signupPassword" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  id="signupPassword"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  id="mobile"
                  value={signupMobile}
                  onChange={(e) => setSignupMobile(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              {signupError && (
                <p className="text-red-600 text-sm">{signupError}</p>
              )}
              {signupSuccess && (
                <p className="text-green-600 text-sm">Registration successful! Redirecting to login...</p>
              )}
              <button
                type="submit"
                disabled={signupLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {signupLoading ? "Creating Account..." : "Create Account"}
              </button>
            </form>
          </div>
        )}

        {/* Forgot Password (Email) View */}
        {view === MODAL_VIEW.FORGOT_PASSWORD_EMAIL && (
          <>
            <h2 className="text-2xl font-semibold text-center mb-6">Forgot Password</h2>
            <form className="space-y-4" onSubmit={handleForgotPasswordEmail}>
              <div>
                <label className="block text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={forgotPasswordEmail}
                  onChange={(e) => setForgotPasswordEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1E90FF]"
                  placeholder="Enter your email"
                  required
                />
              </div>
              {forgotPasswordError && <div className="text-red-500 text-sm text-center">{forgotPasswordError}</div>}
              {forgotPasswordSuccess && <div className="text-green-600 text-sm text-center">{forgotPasswordSuccess}</div>}
              <button type="submit" className="w-full bg-[#1E90FF] text-white py-2 rounded-md hover:bg-[#1876cc] transition" disabled={forgotPasswordLoading}>
                {forgotPasswordLoading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
            <div className="text-center mt-4">
              <button className="text-[#1E90FF] hover:underline text-sm" onClick={() => setView(MODAL_VIEW.LOGIN)}>Back to Log in</button>
            </div>
          </>
        )}

        {/* Reset Password View */}
        {view === MODAL_VIEW.RESET_PASSWORD && (
          <>
            <h2 className="text-2xl font-semibold text-center mb-6">Reset Password</h2>
            <form className="space-y-4" onSubmit={handleResetPassword}>
              <div>
                <label className="block text-gray-700 mb-1">Verification Code</label>
                <input
                  type="text"
                  value={resetPasswordToken}
                  onChange={(e) => setResetPasswordToken(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1E90FF]"
                  placeholder="Enter verification code"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1E90FF]"
                  placeholder="Enter new password"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1E90FF]"
                  placeholder="Confirm new password"
                  required
                />
              </div>
              {resetPasswordError && <div className="text-red-500 text-sm text-center">{resetPasswordError}</div>}
              {resetPasswordSuccess && <div className="text-green-600 text-sm text-center">{resetPasswordSuccess}</div>}
              <button type="submit" className="w-full bg-[#1E90FF] text-white py-2 rounded-md hover:bg-[#1876cc] transition" disabled={resetPasswordLoading}>
                {resetPasswordLoading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
            <div className="text-center mt-4">
              <button className="text-[#1E90FF] hover:underline text-sm" onClick={() => setView(MODAL_VIEW.FORGOT_PASSWORD_EMAIL)}>Back</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}; 



