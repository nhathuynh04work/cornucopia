import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Globe } from "lucide-react";
import { env } from "../env";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import ErrorPopover from "./ErrorPopover";
import authApi from "../apis/authApi";

function SignupForm() {
	const { user } = useAuth();
	const [message, setMessage] = useState("");

	const {
		register,
		handleSubmit,
		formState: { isSubmitting, errors },
	} = useForm({
		mode: "onSubmit",
		reValidateMode: "onSubmit",
	});

	async function onSubmit(formData) {
		setMessage("");
		try {
			const message = await authApi.signup(formData);
			setMessage(message);
		} catch (err) {
			toast.error(err.message || "Signup failed");
		}
	}

	function handleGoogleSignup() {
		window.location.href = `${env.API_URL}/auth/google`;
	}

	if (user) return <Navigate to="/" replace />;

	return (
		<div className="w-full max-w-md p-8">
			<h1 className="text-3xl font-medium text-gray-800 mb-6">
				Create your account
			</h1>

			{/* Google signup */}
			<button
				onClick={handleGoogleSignup}
				className="flex items-center justify-center gap-2 w-full border border-gray-300 rounded px-4 py-2 text-gray-700 hover:bg-gray-50 transition mb-6">
				<Globe className="w-5 h-5 text-red-500" />
				<span>Continue with Google</span>
			</button>

			{/* Divider */}
			<div className="flex items-center mb-6">
				<div className="flex-grow border-t border-gray-300" />
				<span className="px-2 text-sm text-gray-400">or</span>
				<div className="flex-grow border-t border-gray-300" />
			</div>

			{/* API Success/Info Message */}
			{message && (
				<p className="text-sm text-center text-blue-600 mb-4">
					{message}
				</p>
			)}

			<form
				className="flex flex-col gap-6"
				onSubmit={handleSubmit(onSubmit)}>
				{/* Name */}
				<div>
					<label
						htmlFor="name"
						className="block text-sm font-medium text-gray-700">
						Name
					</label>
					<ErrorPopover error={errors.name}>
						<input
							{...register("name", {
								required: "Name is required",
								minLength: {
									value: 2,
									message: "Must be at least 2 characters",
								},
							})}
							className={`mt-1 w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:border-purple-500 ${
								errors.name
									? "border-red-500 ring-red-500"
									: "focus:ring-purple-500"
							}`}
						/>
					</ErrorPopover>
				</div>

				{/* Email */}
				<div>
					<label
						htmlFor="email"
						className="block text-sm font-medium text-gray-700">
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

				{/* Password */}
				<div>
					<label
						htmlFor="password"
						className="block text-sm font-medium text-gray-700">
						Password
					</label>
					<ErrorPopover error={errors.password}>
						<input
							type="password"
							{...register("password", {
								required: "Password is required",
								minLength: {
									value: 8,
									message: "Must be at least 8 characters",
								},
								pattern: {
									value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
									message: "Must include a letter and number",
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

				{/* Submit */}
				<button
					type="submit"
					disabled={isSubmitting}
					className="w-full bg-purple-600 text-white font-medium py-2 rounded hover:bg-purple-700 transition">
					{isSubmitting ? "Signing up..." : "Sign Up"}
				</button>
			</form>

			{/* Footer links */}
			<div className="mt-6 text-sm text-center text-gray-600">
				Already have an account?{" "}
				<Link to="/login" className="text-purple-600 hover:underline">
					Log in
				</Link>
			</div>
		</div>
	);
}

export default SignupForm;
