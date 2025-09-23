import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { api } from "../apis/axios";
import { useAuth } from "../contexts/AuthContext";

function Confirm() {
	const location = useLocation();
	const params = new URLSearchParams(location.search);
	const token = params.get("token");

	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [message, setMessage] = useState(null);

	const { login } = useAuth();
	const navigate = useNavigate();

	// Confirm email on mount
	useEffect(() => {
		// If no token in query params, don’t even try request
		if (!token) {
			setError("Invalid confirmation link");
			setLoading(false);
			return;
		}

		const confirmEmail = async () => {
			try {
				const res = await api.get("/auth/confirm", {
					params: { token },
				});

				const { token: jwt } = res.data;
				login(jwt);

				setMessage("Email confirmed successfully");
				setError(null);

				navigate("/", { replace: true });
			} catch (err) {
				setError(err.response?.data?.error || "An error occurred");
				setMessage(null);
			} finally {
				setLoading(false);
			}
		};

		confirmEmail();
	}, [token, login, navigate]);

	if (loading) return <p>Confirming your email...</p>;

	if (error) return <p style={{ color: "red" }}>{error}</p>;

	return (
		<p style={{ color: "green" }}>
			{message}. Redirecting you to main page...
		</p>
	);
}

export default Confirm;
