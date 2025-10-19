import { useLocation } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { useEffect } from "react";

function AuthCallback() {
	const location = useLocation();
	const { setAuthenticatedSession } = useAuth();

	const params = new URLSearchParams(location.search);
	const token = params.get("token");

	useEffect(() => {
		setAuthenticatedSession(token);
	}, [token, setAuthenticatedSession]);

	return null;
}

export default AuthCallback;
