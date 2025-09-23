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
					className="text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors">
					{item.name}
				</NavButton>
			))}
		</nav>
	);
}

export default NavMenu;
