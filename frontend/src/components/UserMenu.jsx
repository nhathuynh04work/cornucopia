import { useAuth } from "../contexts/AuthContext";
import Avatar from "./Avatar";
import { useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { ChevronDown, LogOut } from "lucide-react";
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

function UserMenu() {
	const { user, logout } = useAuth();

	// use this state to control the Popover
	const [isOpen, setIsOpen] = useState(false);

	if (!user) return null;

	function handleLogout() {
		logout();
		setIsOpen(false);
	}

	return (
		// Use Popover.Root to manage the state
		<Popover.Root open={isOpen} onOpenChange={setIsOpen}>
			{/* trigger button */}
			<Popover.Trigger asChild>
				<div className="cursor-pointer flex items-center select-none rounded-full px-2 py-[4px] hover:bg-gray-100">
					<Avatar user={user} />
					<ChevronDown
						className={`w-3 h-3 ml-2 transition-transform ${
							isOpen ? "rotate-180" : "rotate-0"
						}`}
					/>
				</div>
			</Popover.Trigger>

			{/* This portals the content to document.body */}
			<Popover.Portal>
				{/* the dropdown. Radix handles all positioning! */}
				<Popover.Content
					side="bottom"
					align="end"
					sideOffset={12}
                    onOpenAutoFocus={(e) => e.preventDefault()}
					className="flex flex-col w-64 shadow-xl bg-white border border-gray-200 rounded-lg overflow-hidden z-20
                               data-[state=open]:animate-in data-[state=closed]:animate-out 
                               data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 
                               data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
					{/* Name & email */}
					<NavButton
						to="/profile"
						onClick={() => setIsOpen(false)} // Close on navigation
						className="group flex p-4 cursor-pointer w-full space-x-4 hover:bg-gray-50">
						<Avatar user={user} size="md" />
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
									onClick={() => setIsOpen(false)} // Close on navigation
									className="text-sm text-gray-600 font-normal w-full px-4 py-2 text-left hover:bg-gray-50 hover:text-indigo-600">
									{item.name}
								</NavButton>
							))}
						</div>
					))}

					{/* Log out */}
					<div className="border-t border-gray-200">
						<ActionButton
							onClick={handleLogout}
							className="flex items-center justify-between text-sm text-gray-600 w-full px-4 py-3 hover:bg-gray-50 hover:text-red-600">
							<span>Log out</span>
							<LogOut className="w-4 h-4" />
						</ActionButton>
					</div>
				</Popover.Content>
			</Popover.Portal>
		</Popover.Root>
	);
}

export default UserMenu;
