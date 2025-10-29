import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Globe } from "lucide-react";
import { env } from "../env";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import ErrorPopover from "./ErrorPopover";

function LoginForm() {
  const { user, login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  async function onSubmit(credentials) {
    try {
      await login(credentials);
    } catch (err) {
      toast.error(err.message);
    }
  }

  function handleGoogleLogin() {
    window.location.href = `${env.API_URL}/auth/google`;
  }

  if (user) return <Navigate to="/" replace />;

  return (
    <div className="w-md p-8">
      <h1 className="text-3xl font-medium text-gray-800 mb-6">
        Log in to your account
      </h1>

      {/* Google login */}
      <button
        onClick={handleGoogleLogin}
        className="flex items-center justify-center gap-2 w-full border border-gray-300 rounded px-4 py-2 text-gray-700 hover:bg-gray-50 transition mb-6"
      >
        <Globe className="w-5 h-5 text-red-500" />
        <span>Continue with Google</span>
      </button>

      {/* Divider */}
      <div className="flex items-center mb-6">
        <div className="flex-grow border-t border-gray-300" />
        <span className="px-2 text-sm text-gray-400">or</span>
        <div className="flex-grow border-t border-gray-300" />
      </div>

      <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <ErrorPopover error={errors.email}>
            <input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              className={`mt-1 w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:border-purple-500 ${
                errors.email
                  ? "border-red-500 ring-red-500"
                  : "focus:ring-purple-500"
              }`}
            />
          </ErrorPopover>
        </div>

        <div>
          <div className="flex justify-between items-center">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-xs text-purple-600 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <ErrorPopover error={errors.password}>
            <input
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Must be at least 8 characters",
                },
              })}
              className={`mt-1 w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:border-purple-500 ${
                errors.password
                  ? "border-red-500 ring-red-500"
                  : "focus:ring-purple-500"
              }`}
            />
          </ErrorPopover>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-purple-600 text-white font-medium py-2 rounded hover:bg-purple-700 transition"
        >
          {isSubmitting ? "Logging in..." : "Log In"}
        </button>
      </form>

      <div className="mt-6 text-sm text-center text-gray-600">
        Don’t have an account?{" "}
        <Link to="/signup" className="text-purple-600 hover:underline">
          Sign up
        </Link>
      </div>
    </div>
  );
}

export default LoginForm;
