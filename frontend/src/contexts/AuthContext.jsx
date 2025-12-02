import { createContext, useContext } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { Loader2 } from "lucide-react";
import { ACCESS_TOKEN_KEY } from "../lib/constants";
import authApi from "../apis/authApi";

const AuthContext = createContext();

export function AuthProvider({ children }) {
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const { data: user, isLoading } = useQuery({
		queryKey: ["auth", "user"],
		queryFn: async () => {
			try {
				if (!localStorage.getItem(ACCESS_TOKEN_KEY)) {
					return null;
				}
				const user = await authApi.getMe();
				return user;
			} catch {
				localStorage.removeItem(ACCESS_TOKEN_KEY);
				return null;
			}
		},
		retry: false,
		refetchOnWindowFocus: false,
	});

	async function setAuthenticatedSession(token) {
		localStorage.setItem(ACCESS_TOKEN_KEY, token);
		await queryClient.invalidateQueries({ queryKey: ["auth", "user"] });
		navigate("/dashboard");
	}

	async function login(credentials) {
		const token = await authApi.login(credentials);
		await setAuthenticatedSession(token);
	}

	function logout() {
		localStorage.removeItem(ACCESS_TOKEN_KEY);
		queryClient.setQueryData(["auth", "user"], null);
		navigate("/");
	}

	if (isLoading) {
		return (
			<div className="h-screen w-screen flex items-center justify-center bg-gray-50">
				<Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
			</div>
		);
	}

	const value = {
		role: user?.role,
		user,
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
