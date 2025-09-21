import { Link } from "react-router";
import { api } from "../apis/axios";
import { useState } from "react";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
const nameRegex = /^[A-Za-z\s]{2,}$/;

function Signup() {
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

	return (
		<div>
			Signup
			<Link to="/login">Login</Link>
			<Link to="/">Home</Link>
			{message && <div>{message}</div>}
			<form
				className="flex flex-col gap-2 w-xl"
				onSubmit={(e) => {
					e.preventDefault();
					handleLocalSignup();
				}}>
				<label htmlFor="email">Email</label>
				<input
					name="email"
					type="text"
					value={formData.email}
					onChange={(e) => handleChange(e)}
					placeholder="Email"
					className="border border-black"
				/>
				{errors.email && (
					<span className="text-red-500">{errors.email}</span>
				)}

				<label htmlFor="password">Password</label>
				<input
					name="password"
					type="password"
					value={formData.password}
					onChange={(e) => handleChange(e)}
					placeholder="Password"
					className="border border-black"
				/>
				{errors.password && (
					<span className="text-red-500">{errors.password}</span>
				)}

				<label htmlFor="name">Name</label>
				<input
					name="name"
					type="text"
					value={formData.name}
					onChange={(e) => handleChange(e)}
					placeholder="Name"
					className="border border-black"
				/>
				{errors.name && (
					<span className="text-red-500">{errors.name}</span>
				)}

				<button
					type="submit"
					disabled={loading}
					className="border border-black">
					{loading ? "Signing up..." : "Sign Up"}
				</button>
			</form>
		</div>
	);
}

export default Signup;
