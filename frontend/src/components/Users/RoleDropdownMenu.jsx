import { Role } from "@/lib/constants";

export default function RoleDropdownMenu({ currentRole, onSelect }) {
	const AVAILABLE_ROLES = [Role.USER, Role.CREATOR, Role.ADMIN];

	return (
		<div className="absolute right-0 mt-1 w-36 bg-white border border-gray-200 rounded-md shadow-lg z-10 overflow-hidden">
			{AVAILABLE_ROLES.map((role) => (
				<button
					key={role}
					onClick={() => onSelect(role)}
					className={`w-full text-left px-3 py-2 text-sm transition-colors ${
						role === currentRole
							? "bg-gray-100 font-semibold text-gray-500 cursor-not-allowed"
							: "hover:bg-gray-50 text-gray-700"
					}`}>
					{role}
				</button>
			))}
		</div>
	);
}
