import { useState, useEffect } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { OtpInput } from "./Otpverification";
import { useAuth } from "../contexts/AuthContext";
import { userAPI } from "../utils/api";
import {
  faEnvelope,
  faLock,
  faArrowRight,
  faUser,
  faPhone,
  faUnlock,
} from "@fortawesome/free-solid-svg-icons";

export const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [OtpVerified, setOtpVerified] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const validatePassword = (password, confirmPassword) => {
    if (password.length < 8) return "Password must be at least 8 characters long";
    if (password !== confirmPassword) return "Passwords do not match";
    return null;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validate form
    if (!formData.username || !formData.email || !formData.password) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    const passwordError = validatePassword(formData.password, formData.confirmPassword);
    if (passwordError) {
      setError(passwordError);
      setLoading(false);
      return;
    }

    // Add validation for required fields
    if (!formData.username || !formData.email || !formData.password) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    try {
      console.log("Sending registration data:", {
        username: formData.username,
        email: formData.email,
        password: "***hidden***"
      });

      // Register user
      const response = await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      if (response.success) {
        console.log(response);
        setUserId(response.data.user._id);
        // Request verification email
        await userAPI.requestVerificationMail(response.data.user._id);
        setShowOtpInput(true);
      } else {
        console.log(response);
        setError(response.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="grid-cols-subgrid content-center px-4 sm:px-6 lg:px-8">
        {!showOtpInput && (
          <>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-6 sm:mb-8 lg:mb-10 text-[#333333] dark:text-white">
              User Register
            </h1>
            <form action="" method="post" className="w-full sm:w-[80%] lg:w-[60%] place-self-center max-w-md">
              <div className="h-full w-full flex flex-col text-black">
                <div className="py-3 px-4 sm:px-5 outline-none border-gray-300 border-1 rounded-full bg-[#e6e6e6] mb-4 sm:mb-5 flex items-center min-h-[48px]">
                  <FontAwesomeIcon
                    icon={faUser}
                    className="pr-3 text-[#1e3050] text-sm sm:text-base"
                  />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="outline-none w-full text-sm sm:text-base bg-transparent"
                    placeholder="Name"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  />
                </div>
                <div className="py-3 px-4 sm:px-5 outline-none border-gray-300 border-1 rounded-full bg-[#e6e6e6] mb-4 sm:mb-5 flex items-center min-h-[48px]">
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    className="pr-3 text-[#1e3050] text-sm sm:text-base"
                  />
                  <input
                    type="email"
                    id="userId"
                    name="userId"
                    className="outline-none w-full text-sm sm:text-base bg-transparent"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="py-3 px-4 sm:px-5 outline-none border-gray-300 border-1 rounded-full bg-[#e6e6e6] mb-4 sm:mb-5 flex items-center min-h-[48px]">
                  <FontAwesomeIcon
                    icon={faLock}
                    className="pr-3 text-[#1e3050] text-sm sm:text-base"
                  />
                  <input
                    type="password"
                    id="set-password"
                    name="set-password"
                    className="outline-none w-full text-sm sm:text-base bg-transparent"
                    placeholder="Set Password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
                <div className="py-3 px-4 sm:px-5 outline-none border-gray-300 border-1 rounded-full bg-[#e6e6e6] mb-4 sm:mb-5 flex items-center min-h-[48px]">
                  <FontAwesomeIcon
                    icon={faUnlock}
                    className="pr-3 text-[#1e3050] text-sm sm:text-base"
                  />
                  <input
                    type="password"
                    id="confirm-password"
                    name="confirm-password"
                    className="outline-none w-full text-sm sm:text-base bg-transparent"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  />
                </div>
              </div>
              {error && (
                <div className="text-red-500 text-xs sm:text-sm text-center mb-3">
                  {error}
                </div>
              )}
              <button
                type="submit"
                className="w-full bg-green-600 py-3 px-4 sm:px-5 outline-none rounded-full my-4 sm:my-5 text-white font-bold cursor-pointer disabled:opacity-50 text-sm sm:text-base min-h-[48px] hover:bg-green-700 transition-colors"
                disabled={loading}
                onClick={handleRegister}
              >
                {loading ? "REGISTERING..." : "REGISTER"}
              </button>
            </form>
          </>
        )}
        {showOtpInput && !OtpVerified && (
          <div className="w-full max-w-md mx-auto px-4">
            <OtpInput userId={userId} setotpVerified={setOtpVerified} />
          </div>
        )}
        {showOtpInput && OtpVerified && <Navigate to="/auth/login" />}
      </div>
      {!showOtpInput && (
        <div
          className="text-center cursor-pointer px-4 py-2"
          onClick={() => navigate("/auth/login")}
        >
          <span className="text-sm sm:text-base text-[#333333] dark:text-white hover:text-[#1e3050] dark:hover:text-gray-300 transition-colors">
            Already a User
            <FontAwesomeIcon icon={faArrowRight} className="pl-1 text-xs sm:text-sm" />
          </span>
        </div>
      )}
    </>
  );
};