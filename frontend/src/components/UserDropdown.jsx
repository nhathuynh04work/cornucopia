import { useAuth } from "../contexts/AuthContext";
import { LogOut } from "lucide-react";
import Avatar from "./Avatar";
import ActionButton from "./ActionButton";
import NavButton from "./NavButton";

const menuItems = [
	{
		name: "User Settings",
		items: [
			{ name: "Edit profile", link: "/profile/edit" },
			{ name: "Statistics", link: "/stats" },
		],
	},
	{
		name: "My Content",
		items: [
			{ name: "My learning", link: "/courses/me" },
			{ name: "My flashcards", link: "/flashcards/me" },
		],
	},
];

function UserDropdown({ user }) {
	const { logout } = useAuth();

	return (
		<div className="absolute top-[calc(100%+12px)] right-0 flex flex-col w-64 shadow-xl bg-white border border-gray-200 rounded-lg overflow-hidden">
			{/* Name & email */}
			<NavButton
				to="/profile"
				className="group flex p-4 cursor-pointer w-full space-x-4 hover:bg-gray-50">
				<Avatar size="medium" />
				<div className="flex flex-col overflow-hidden space-y-1">
					<div className="font-semibold group-hover:text-indigo-600 line-clamp-2">
						{user.name}
					</div>
					<div className="text-xs font-light text-gray-500 truncate">
						{user.email}
					</div>
				</div>
			</NavButton>

			{/* Menu items */}
			{menuItems.map((section) => (
				<div
					className="border-t border-gray-200 flex flex-col"
					key={section.name}>
					<div className="px-4 pt-3 pb-1 text-[11px] uppercase tracking-wide text-gray-400 font-medium">
						{section.name}
					</div>
					{section.items.map((item) => (
						<NavButton
							to={item.link}
							key={item.name}
							className="text-sm text-gray-600 font-normal w-full px-4 py-2 text-left hover:bg-gray-50 hover:text-indigo-600">
							{item.name}
						</NavButton>
					))}
				</div>
			))}

			{/* Log out */}
			<div className="border-t border-gray-200">
				<ActionButton
					onClick={logout}
					className="flex items-center justify-between text-sm text-gray-600 w-full px-4 py-3 hover:bg-gray-50 hover:text-red-600">
					<span>Log out</span>
					<LogOut className="w-4 h-4" />
				</ActionButton>
			</div>
		</div>
	);
}

export default UserDropdown;
