import { useLocation, useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { useEffect } from "react";
import toast from "react-hot-toast";

function AuthCallback() {
	const navigate = useNavigate();
	const location = useLocation();
	const { login } = useAuth();

	useEffect(() => {
		const params = new URLSearchParams(location.search);
		const provider = params.get("provider") || "OAuth";
		const token = params.get("token");
		const error = params.get("error");

		if (error) {
			console.error("OAuth failed:", error);
			toast.error(`Authentication using ${provider} failed`);
			navigate("/login");
			return;
		}

		if (token) {
			// Call the login() from AuthContext
			login(token);

			// Toast
			toast.success(`Sign in using ${provider} successfully`);

			// Redirect after login
			navigate("/");
		} else {
			navigate("/login");
		}
	}, [location.search, navigate, login]);

	return <p>Signing you in...</p>;
}

export default AuthCallback;
