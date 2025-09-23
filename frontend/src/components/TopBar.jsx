import { useAuth } from "../contexts/AuthContext";
import Logo from "./Logo";
import NavMenu from "./NavMenu";
import UserMenu from "./UserMenu";
import NavButton from "./NavButton";

function NavBar() {
	const { user } = useAuth();

	return (
		<div className="flex justify-between items-center px-6 py-3 bg-white border-b border-gray-200 shadow-sm">
			{/* Logo / App name */}
			<div className="min-w-[180px]">
				<Logo />
			</div>

			{/* Middle navigation */}
			<div className="flex items-center space-x-6">
				<NavMenu />
			</div>

			{/* Right side (fixed width to prevent shifting) */}
			<div className="flex items-center justify-end space-x-4 min-w-[180px]">
				{user ? (
					<UserMenu />
				) : (
					<div className="flex items-center space-x-2 py-[2px]">
						<NavButton
							to="login"
							className="px-4 py-2 text-sm font-medium text-gray-700 ring-1 ring-gray-300 rounded hover:bg-gray-100">
							Log in
						</NavButton>
						<NavButton
							to="signup"
							className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded hover:bg-purple-700">
							Sign up
						</NavButton>
					</div>
				)}
			</div>
		</div>
	);
}

export default NavBar;
