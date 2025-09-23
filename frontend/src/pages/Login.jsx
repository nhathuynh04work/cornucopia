import { Link, Navigate, useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";
import { api } from "../apis/axios";
import { toast } from "react-hot-toast";

function Login() {
	const { user, login } = useAuth();
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
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
			// Call backend
			const res = await api.post("/auth/login", formData);

			const { token } = res.data;

			// Save token in AuthContext
			login(token);

			// Show success message
			toast.success("Logged in successfully");

			// Redirect to home
			navigate("/", { replace: true });
		} catch (err) {
			setError(err.response?.data?.error || "Login failed");
		} finally {
			setLoading(false);
		}
	}

	// If user is already logged in, redirect to home
	if (user) {
		return <Navigate to="/" replace />;
	}

	return (
		<div className="max-w-md mx-auto mt-10 p-6 border rounded-md shadow-md">
			<h1 className="text-xl font-bold mb-4">Login</h1>

			{error && <p className="text-red-500 mb-2">{error}</p>}

			<form className="flex flex-col gap-3" onSubmit={handleLocalLogin}>
				<label htmlFor="email" className="font-medium">
					Email
				</label>
				<input
					name="email"
					type="email"
					value={formData.email}
					onChange={handleChange}
					placeholder="Email"
					className="border border-gray-300 rounded px-3 py-2"
				/>

				<label htmlFor="password" className="font-medium">
					Password
				</label>
				<input
					name="password"
					type="password"
					value={formData.password}
					onChange={handleChange}
					placeholder="Password"
					className="border border-gray-300 rounded px-3 py-2"
				/>

				<button
					type="submit"
					disabled={loading}
					className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
					{loading ? "Logging in..." : "Log In"}
				</button>
			</form>

			<div className="mt-4 text-sm text-center">
				Don't have an account?{" "}
				<Link to="/signup" className="text-blue-600 hover:underline">
					Sign up
				</Link>
			</div>
		</div>
	);
}

export default Login;
