import React, { useState, useEffect } from "react";
import { getAccessToken, forgotPassword, resetPassword } from "../API/config";
import { registerUser } from "../API/UserApi";

const MODAL_VIEW = {
  SOCIAL: "SOCIAL",
  LOGIN: "LOGIN",
  SIGNUP: "SIGNUP",
  FORGOT_PASSWORD_EMAIL: "FORGOT_PASSWORD_EMAIL",
  RESET_PASSWORD: "RESET_PASSWORD",
};

export const AuthModal = ({ open, onClose }) => {
  const [view, setView] = useState(MODAL_VIEW.SOCIAL);
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

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
    }
  }, [open]);

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
      emailAddress: signupEmail,
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
            <h2 className="text-2xl font-semibold text-center mb-6">Sign up or log in</h2>
            <button className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-md py-2 mb-3 hover:bg-gray-50 transition">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
              Continue with Google
            </button>
            <button className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-md py-2 mb-6 hover:bg-gray-50 transition">
              <img src="https://www.svgrepo.com/show/157818/facebook.svg" alt="Facebook" className="w-5 h-5" />
              Continue with Facebook
            </button>
            <div className="text-center text-gray-500 mb-4">Or register with <button className="text-[#1E90FF] hover:underline" onClick={() => setView(MODAL_VIEW.SIGNUP)}>email</button></div>
            <div className="text-center text-gray-500 text-sm">
              Already have an account?{' '}
              <button className="text-[#1E90FF] hover:underline" onClick={() => setView(MODAL_VIEW.LOGIN)}>Log in</button>
            </div>
          </>
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

        {/* Sign Up View */}
        {view === MODAL_VIEW.SIGNUP && (
          <>
            <h2 className="text-2xl font-semibold text-center mb-6">Sign up with email</h2>
            <form className="space-y-4" onSubmit={handleSignup}>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-gray-700 mb-1">First Name</label>
                  <input type="text" value={signupFirstName} onChange={e => setSignupFirstName(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1E90FF]" placeholder="First Name" required />
                </div>
                <div className="flex-1">
                  <label className="block text-gray-700 mb-1">Last Name</label>
                  <input type="text" value={signupLastName} onChange={e => setSignupLastName(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1E90FF]" placeholder="Last Name" required />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Email</label>
                <input type="email" value={signupEmail} onChange={e => setSignupEmail(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1E90FF]" placeholder="Email" required />
                <div className="text-xs text-gray-500 mt-1">Enter the email you want to use</div>
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Password</label>
                <input type="password" value={signupPassword} onChange={e => setSignupPassword(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1E90FF]" placeholder="Password" required />
                <div className="text-xs text-gray-500 mt-1">Enter at least 7 characters, including at least 1 letter and at least 1 number</div>
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Mobile Number</label>
                <input type="text" value={signupMobile} onChange={e => setSignupMobile(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1E90FF]" placeholder="Mobile Number" required />
              </div>
              {signupError && <div className="text-red-500 text-sm text-center">{signupError}</div>}
              {signupSuccess && <div className="text-green-600 text-sm text-center">Registration successful! You can now log in.</div>}
              <button type="submit" className="w-full bg-[#1E90FF] text-white py-2 rounded-md hover:bg-[#1876cc] transition" disabled={signupLoading}>{signupLoading ? "Signing up..." : "Sign up"}</button>
            </form>
            <div className="text-center text-gray-500 text-sm mt-4">
              Already have an account?{' '}
              <button className="text-[#1E90FF] hover:underline" onClick={() => setView(MODAL_VIEW.LOGIN)}>Log in</button>
            </div>
          </>
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