import { Link } from "react-router";

function Signup() {
	return (
		<div>
			Signup
			<Link to="/login">Login</Link>
			<Link to="/">Home</Link>
		</div>
	);
}

export default Signup;
