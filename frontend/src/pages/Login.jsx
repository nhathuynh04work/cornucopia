import { Navigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import LoginForm from "../components/LoginForm";

function Login() {
	const { user } = useAuth();

	if (user) {
		return <Navigate to="/dashboard" replace />;
	}

	return (
		<div className="flex">
			{/* Left side illustration */}
			<div className="w-1/2 flex items-center justify-center">
				<img src="login-hero.svg" alt="Login Hero" className="h-5/6" />
			</div>

			{/* Right side form */}
			<div className="w-1/2 px-6 flex justify-center items-center">
				<LoginForm />
			</div>
		</div>
	);
}

export default Login;
