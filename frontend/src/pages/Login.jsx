import { Link } from "react-router";

function Login() {
	return (
		<div>
			Login
			<Link to="/signup">Signup</Link>
			<Link to="/">Home</Link>
		</div>
	);
}

export default Login;
