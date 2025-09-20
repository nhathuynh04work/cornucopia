import { Link } from "react-router";

function Home() {
	return (
		<div>
			Home
			<Link to="/signup">Signup</Link>
			<Link to="/login">Login</Link>
		</div>
	);
}

export default Home;
