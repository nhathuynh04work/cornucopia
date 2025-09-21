import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { api } from "../apis/axios";

function Confirm() {
	const location = useLocation();
	const params = new URLSearchParams(location.search);
	const token = params.get("token");

	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [message, setMessage] = useState(null);

	// Confirm email using token
	useEffect(() => {
		if (!token) return;

		// Make API call to confirm the token
		api.get("/auth/confirm", { params: { token } })
			.then((res) => {
				setMessage(res.data.message);
				setError(null);
			})
			.catch((err) => {
				setError(err.response?.data?.error || "An error occurred");
				setMessage(null);
			})
			.finally(() => {
				setLoading(false);
			});
	}, [token]);

	// Redirect after successful confirmation
	useEffect(() => {
		if (!message) return;

		const timer = setTimeout(() => {
			window.location.href = "/";
		}, 2000);

		return () => clearTimeout(timer);
	}, [message]);

	if (!token) {
		return <p style={{ color: "red" }}>Invalid confirmation link</p>;
	}

	return (
		<div>
			{loading && <p>Confirming your email...</p>}
			{error && <p style={{ color: "red" }}>{error}</p>}
			{message && (
				<p style={{ color: "green" }}>
					{message}. Redirecting you to main page...
				</p>
			)}
		</div>
	);
}

export default Confirm;
