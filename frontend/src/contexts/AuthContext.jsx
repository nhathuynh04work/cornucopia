import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../apis/axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	// Fetch current user on mount (only if we don't already have one)
	useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token) return setLoading(false);

		// Only fetch if user is not already set (e.g. from login or confirm)
		if (!user) {
			api.get("/auth/me", {
				headers: { Authorization: `Bearer ${token}` },
			})
				.then((res) => setUser(res.data.user))
				.catch(() => setUser(null))
				.finally(() => setLoading(false));
		} else {
			setLoading(false);
		}
	}, []);

	function login(token) {
		window.localStorage.setItem("token", token);

		api.get("/auth/me", {
			headers: { Authorization: `Bearer ${token}` },
		})
			.then((res) => setUser(res.data.user))
			.catch(() => setUser(null));
	}

	function logout() {
		window.localStorage.removeItem("token");
		setUser(null);
	}

	return (
		<AuthContext.Provider value={{ user, loading, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
	return useContext(AuthContext);
}
