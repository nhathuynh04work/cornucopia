import { useAuth } from "@/contexts/AuthContext";
import NavButton from "./NavButton";
import { Role } from "@/lib/constants";

const navItems = [
	{ name: "Tests", path: "/tests" },
	{ name: "Blog", path: "/posts" },
	{ name: "Flashcards", path: "/flashcards" },
	{ name: "Courses", path: "/courses" },
];

function NavMenu() {
	const { role } = useAuth();

	const visible =
		role === Role.ADMIN
			? [...navItems, { name: "Users", path: "/users" }]
			: navItems;

	return (
		<nav className="flex items-center space-x-6">
			{visible.map((item) => (
				<NavButton
					key={item.name}
					to={item.path}
					end={false}
					className="text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors px-1 py-1"
					activeClassName="text-purple-600 underline underline-offset-4">
					{item.name}
				</NavButton>
			))}
		</nav>
	);
}

export default NavMenu;
