import { useState, useContext } from "react";
import { Eye, EyeOff, Mail, Lock, AlertCircle } from "lucide-react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { userContext } from "../context/authContext.jsx";
import { useNavigate } from "react-router-dom";


// Validation schema (pure JS, no TS needed)
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
});

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useContext(userContext);
  const navigate = useNavigate();

  const baseUrl = import.meta.env.VITE_SERVER_URL;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setServerError("");
    setLoading(true);

    try {
      // { withCredentials: true } to include cookies
      const response = await axios.post(`${baseUrl}/api/auth/login`, data, { withCredentials: true });
      console.log("Login successful:", response.data);

      if(response.data.success){
        login(response.data.user);

        if(response.data.user.role === "admin"){
          navigate("/admin-dashboard");
        }else{
          navigate("/employee-dashboard");
        }
      }
      

    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Invalid email or password. Please try again.";
      setServerError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-700 via-purple-600 to-purple-800 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-purple-700 px-10 py-12 text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                <div className="w-12 h-12 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white tracking-tighter">
                    TBB
                  </span>
                </div>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white">Welcome Back!</h1>
            <p className="text-purple-200 mt-2 text-lg">
              Sign in to your TomBrownBabies account
            </p>
          </div>

          {/* Form */}
          <div className="px-10 py-12">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Server Error */}
              {serverError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-3 animate-pulse">
                  <AlertCircle className="h-5 w-5" />
                  <p className="text-sm font-medium">{serverError}</p>
                </div>
              )}

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-purple-500" />
                  </div>
                  <input
                    {...register("email")}
                    type="email"
                    disabled={loading}
                    className={`w-full pl-12 pr-4 py-4 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition ${
                      errors.email
                        ? "border-red-400 focus:border-red-500"
                        : "border-gray-200 focus:border-transparent"
                    }`}
                    placeholder="taruk@tombrownbabies.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-purple-500" />
                  </div>
                  <input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    disabled={loading}
                    className={`w-full pl-12 pr-12 py-4 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition ${
                      errors.password
                        ? "border-red-400 focus:border-red-500"
                        : "border-gray-200 focus:border-transparent"
                    }`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-700"
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    disabled={loading}
                    className="w-5 h-5 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">Remember me</span>
                </label>
                <a href="#" className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                disabled={loading || isSubmitting}
                className={`w-full py-4 rounded-xl font-semibold text-white transition-all duration-200 transform hover:scale-[1.02] shadow-lg flex items-center justify-center gap-3 ${
                  loading || isSubmitting
                    ? "bg-purple-400 cursor-not-allowed"
                    : "bg-purple-700 hover:bg-purple-800"
                }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <a href="#" className="font-semibold text-purple-600 hover:text-purple-700">
                  Contact HR
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-white/80 text-sm">
            © 2025 TomBrownBabies Employee Portal. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}