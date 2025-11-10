import { createContext, useContext, useEffect, useState } from "react";
import { ACCESS_TOKEN_KEY } from "../lib/constants";
import * as authApi from "../apis/authApi";
import { useNavigate } from "react-router";

const AuthContext = createContext();

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null);
	const [isInitialLoading, setIsInitialLoading] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		async function fetchUser() {
			try {
				setIsInitialLoading(true);
				const user = await authApi.getMe();
				setUser(user);
			} catch {
				localStorage.removeItem(ACCESS_TOKEN_KEY);
				setUser(null);
			} finally {
				setIsInitialLoading(false);
			}
		}
        
		fetchUser();
	}, []);

	async function setAuthenticatedSession(token) {
		localStorage.setItem(ACCESS_TOKEN_KEY, token);
		const user = await authApi.getMe();
		setUser(user);
		navigate("/dashboard");
	}

	async function login(credentials) {
		const token = await authApi.login(credentials);
		await setAuthenticatedSession(token);
	}

	function logout() {
		localStorage.removeItem(ACCESS_TOKEN_KEY);
		setUser(null);
		navigate("/dashboard");
	}

	const value = {
		role: user?.userRole.role,
		user,
		isInitialLoading,
		login,
		logout,
		setAuthenticatedSession,
	};

	return (
		<AuthContext.Provider value={value}>{children}</AuthContext.Provider>
	);
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
	return useContext(AuthContext);
}
