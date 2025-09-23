import { Link, Navigate } from "react-router";
import { api } from "../apis/axios";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
const nameRegex = /^[A-Za-z\s]{2,}$/;

function Signup() {
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

		if (!emailRegex.test(formData.email)) {
			newErrors.email = "Invalid email format";
		}

		if (!passwordRegex.test(formData.password)) {
			newErrors.password =
				"Password must be at least 8 characters and contain a letter and a number";
		}

		if (!nameRegex.test(formData.name)) {
			newErrors.name = "Name must be at least 2 letters";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	}

	async function handleLocalSignup() {
		if (!validateFields()) return;
		setLoading(true);
		try {
			const res = await api.post("/auth/signup", formData);
			setMessage(res.data.message);
			setErrors({});
		} catch (err) {
			setMessage("Error: " + (err.response?.data?.error || err.message));
		} finally {
			setLoading(false);
		}
	}

	if (user) {
		return <Navigate to="/" replace />;
	}

	return (
		<div className="w-full max-w-md bg-white p-8 rounded-lg shadow">
			<h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
				Create an account
			</h2>

			{message && (
				<div className="mb-4 text-sm text-center text-blue-600">
					{message}
				</div>
			)}

			<form
				className="flex flex-col gap-4"
				onSubmit={(e) => {
					e.preventDefault();
					handleLocalSignup();
				}}>
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
						className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring focus:ring-blue-200"
						required
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
						className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring focus:ring-blue-200"
						required
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
						className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring focus:ring-blue-200"
						required
					/>
					{errors.password && (
						<p className="text-xs text-red-500 mt-1">
							{errors.password}
						</p>
					)}
				</div>

				{/* Submit button */}
				<button
					type="submit"
					disabled={loading}
					className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-200 transition">
					{loading ? "Signing up..." : "Sign Up"}
				</button>
			</form>

			{/* Footer links */}
			<p className="mt-4 text-sm text-center text-gray-600">
				Already have an account?{" "}
				<Link to="/login" className="text-blue-600 hover:underline">
					Log in
				</Link>
			</p>
			<p className="mt-2 text-sm text-center">
				<Link to="/" className="text-gray-500 hover:underline">
					Back to Home
				</Link>
			</p>
		</div>
	);
}

export default Signup;
