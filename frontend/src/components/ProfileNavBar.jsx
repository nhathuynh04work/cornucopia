import NavButton from "./NavButton";

function ProfileNavBar({ navItems }) {
	return (
		<nav className="flex flex-col w-full">
			{navItems.map((item) => (
				<NavButton
					key={item.name}
					to={item.to}
					className="text-left px-4 py-2 font-extralight text-gray-700"
					activeClassName="bg-gray-300">
					{item.name}
				</NavButton>
			))}
		</nav>
	);
}

export default ProfileNavBar;
