import { Link } from "react-router";
import { useAuth } from "../contexts/AuthContext";

function NavBar() {
	const { user, logout } = useAuth();

	return (
		<nav className="flex justify-between items-center px-6 py-3 bg-gray-100 border-b border-gray-200">
			{/* Logo / App name */}
			<Link
				to="/"
				className="text-lg font-bold text-gray-800 hover:text-gray-600">
				MyApp
			</Link>

			{/* Right side */}
			<div className="flex items-center gap-4">
				{user ? (
					<>
						<span className="text-sm text-gray-700">
							{user.email}
						</span>
						<button
							onClick={logout}
							className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition">
							Log out
						</button>
					</>
				) : (
					<Link
						to="/login"
						className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
						Login
					</Link>
				)}
			</div>
		</nav>
	);
}

export default NavBar;
