import { useState } from "react";
import { Link, Navigate } from "react-router";
import { api } from "../apis/axios";
import { useAuth } from "../contexts/AuthContext";
import { Globe } from "lucide-react";
import { env } from "../env";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
const nameRegex = /^[A-Za-z\s]{2,}$/;

function SignupForm() {
	const { user } = useAuth();
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
	});
	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState({});
	const [message, setMessage] = useState("");

	function handleChange(e) {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	}

	function validateFields() {
		const newErrors = {};
		if (!nameRegex.test(formData.name))
			newErrors.name = "Name must be at least 2 letters";
		if (!emailRegex.test(formData.email))
			newErrors.email = "Invalid email format";
		if (!passwordRegex.test(formData.password))
			newErrors.password =
				"Password must be at least 8 characters with a letter and number";
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	}

	async function handleLocalSignup(e) {
		e.preventDefault();
		setErrors({});
		if (!validateFields()) return;
		setLoading(true);
		try {
			const res = await api.post("/auth/signup", formData);
			setMessage(res.data.message);
		} catch (err) {
			setMessage(err.response?.data?.error || "Signup failed");
		} finally {
			setLoading(false);
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

			{message && (
				<p className="text-sm text-center text-blue-600 mb-4">
					{message}
				</p>
			)}

			<form className="flex flex-col gap-4" onSubmit={handleLocalSignup}>
				{/* Name */}
				<div>
					<label
						htmlFor="name"
						className="block text-sm font-medium text-gray-700">
						Name
					</label>
					<input
						name="name"
						type="text"
						value={formData.name}
						onChange={handleChange}
						placeholder="Your name"
						className="mt-1 w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
					/>
					{errors.name && (
						<p className="text-xs text-red-500 mt-1">
							{errors.name}
						</p>
					)}
				</div>

				{/* Email */}
				<div>
					<label
						htmlFor="email"
						className="block text-sm font-medium text-gray-700">
						Email
					</label>
					<input
						name="email"
						type="email"
						value={formData.email}
						onChange={handleChange}
						placeholder="you@example.com"
						className="mt-1 w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
					/>
					{errors.email && (
						<p className="text-xs text-red-500 mt-1">
							{errors.email}
						</p>
					)}
				</div>

				{/* Password */}
				<div>
					<label
						htmlFor="password"
						className="block text-sm font-medium text-gray-700">
						Password
					</label>
					<input
						name="password"
						type="password"
						value={formData.password}
						onChange={handleChange}
						placeholder="At least 8 characters"
						className="mt-1 w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
					/>
					{errors.password && (
						<p className="text-xs text-red-500 mt-1">
							{errors.password}
						</p>
					)}
				</div>

				{/* Submit */}
				<button
					type="submit"
					disabled={loading}
					className="w-full bg-purple-600 text-white font-medium py-2 rounded hover:bg-purple-700 transition">
					{loading ? "Signing up..." : "Sign Up"}
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
