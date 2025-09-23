import { useAuth } from "../contexts/AuthContext";
import Avatar from "./Avatar";
import UserDropdown from "./UserDropdown";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

function UserMenu() {
	const { user } = useAuth();
	const [showDropdown, setShowDropdown] = useState(false);

	function toggleDropdown() {
		setShowDropdown((prev) => !prev);
	}

	return (
		<div className="relative flex items-center">
			<div
				onClick={toggleDropdown}
				className="cursor-pointer flex items-center select-none rounded-full px-2 py-[4px] hover:bg-gray-100">
				<Avatar />
				<ChevronDown
					className={`w-3 h-3 ml-2 transition-transform ${
						showDropdown ? "rotate-180" : "rotate-0"
					}`}
				/>
			</div>
			{showDropdown && <UserDropdown user={user} />}
		</div>
	);
}

export default UserMenu;
