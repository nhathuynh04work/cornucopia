import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { api } from "../apis/axios";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";
import { Globe } from "lucide-react";
import { env } from "../env";

function LoginForm() {
	const { login } = useAuth();
	const [formData, setFormData] = useState({ email: "", password: "" });
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const navigate = useNavigate();

	function handleChange(e) {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	}

	async function handleLocalLogin(e) {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			const res = await api.post("/auth/login", formData);
			const { token } = res.data;
			login(token);
			toast.success("Logged in successfully");
			navigate("/", { replace: true });
		} catch (err) {
			setError(err.response?.data?.error || "Login failed");
		} finally {
			setLoading(false);
		}
	}

	function handleGoogleLogin() {
		window.location.href = `${env.API_URL}/auth/google`;
	}

	return (
		<div className="w-md p-8">
			<h1 className="text-3xl font-medium text-gray-800 mb-6">
				Log in to your account
			</h1>

			{/* Google login */}
			<button
				onClick={handleGoogleLogin}
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

			{error && <p className="text-red-500 mb-4 text-sm">{error}</p>}

			<form className="flex flex-col gap-4" onSubmit={handleLocalLogin}>
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
						placeholder="Enter your email"
						className="mt-1 w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
					/>
				</div>

				<div>
					<div className="flex justify-between items-center">
						<label
							htmlFor="password"
							className="block text-sm font-medium text-gray-700">
							Password
						</label>
						<Link
							to="/forgot-password"
							className="text-xs text-purple-600 hover:underline">
							Forgot password?
						</Link>
					</div>
					<input
						name="password"
						type="password"
						value={formData.password}
						onChange={handleChange}
						placeholder="Enter your password"
						className="mt-1 w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
					/>
				</div>

				<button
					type="submit"
					disabled={loading}
					className="w-full bg-purple-600 text-white font-medium py-2 rounded hover:bg-purple-700 transition">
					{loading ? "Logging in..." : "Log In"}
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
