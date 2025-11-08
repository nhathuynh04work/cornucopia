import NavButton from "./NavButton";

const navItems = [
	{ name: "Tests", path: "/tests" },
	{ name: "Blog", path: "/blog" },
	{ name: "Flashcards", path: "/flashcards" },
	{ name: "Courses", path: "/courses" },
];

function NavMenu() {
	return (
		<nav className="flex items-center space-x-6">
			{navItems.map((item) => (
				<NavButton
					key={item.name}
					to={item.path}
					end={false}
					className="text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors"
					activeClassName="text-purple-600 underline underline-offset-4 decoration-2">
					{item.name}
				</NavButton>
			))}
		</nav>
	);
}

export default NavMenu;
