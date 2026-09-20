import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faLock,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../contexts/AuthContext";

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    identifier: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!formData.identifier || !formData.password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      const response = await login({
        identifier: formData.identifier,
        password: formData.password
      });

      if (response.success) {
        // Redirect to dashboard or home page
        navigate("/dashboard");
      } else {
        setError(response.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="grid-cols-subgrid content-center px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-6 sm:mb-8 lg:mb-10 text-[#333333] dark:text-white">
          User Login
        </h1>
        <form onSubmit={handleLogin} className="w-full sm:w-[80%] lg:w-[60%] place-self-center max-w-md">
          <div className="h-full w-full flex flex-col text-black">
            <div className="py-3 px-4 sm:px-5 outline-none border-gray-300 border-1 rounded-full bg-[#e6e6e6] mb-4 sm:mb-5 flex items-center min-h-[48px]">
              <FontAwesomeIcon
                icon={faEnvelope}
                className="pr-3 text-[#1e3050] text-sm sm:text-base"
              />
              <input
                type="text"
                id="userId"
                name="userId"
                className="outline-none w-full text-sm sm:text-base bg-transparent"
                placeholder="Email or Username"
                value={formData.identifier}
                onChange={(e) => setFormData({...formData, identifier: e.target.value})}
                required
              />
            </div>
            <div className="py-3 px-4 sm:px-5 outline-none border-gray-300 border-1 rounded-full bg-[#e6e6e6] mb-4 sm:mb-5 flex items-center min-h-[48px]">
              <FontAwesomeIcon icon={faLock} className="pr-3 text-[#1e3050] text-sm sm:text-base" />
              <input
                type="password"
                id="password"
                name="password"
                className="outline-none w-full text-sm sm:text-base bg-transparent"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
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
          >
            {loading ? "LOGGING IN..." : "LOGIN"}
          </button>
        </form>
        <div
          className="w-full mb-4 sm:mb-5 px-4"
          onClick={() => navigate("/auth/forgot-password")}
        >
          <p className="text-center text-xs sm:text-sm text-[#333333c3] cursor-pointer hover:text-[#333333] dark:text-white dark:hover:text-[#9b9b9b] transition-colors">
            Forgot UserID / Password
          </p>
        </div>
      </div>
      <div
        className="text-center cursor-pointer px-4 py-2"
        onClick={() => navigate("/auth/register")}
      >
        <span className="text-sm sm:text-base text-[#333333] dark:text-white hover:text-[#1e3050] dark:hover:text-gray-300 transition-colors">
          Create a Account
          <FontAwesomeIcon icon={faArrowRight} className="pl-1 text-xs sm:text-sm" />
        </span>
      </div>
    </>
  );
};
