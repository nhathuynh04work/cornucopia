import { useLocation } from "react-router";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

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
