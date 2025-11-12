import { useState } from "react";
import { Role } from "@/lib/constants";
import StatusBadge from "../StatusBadge";
import ConfirmationModal from "../ConfirmationModal";
import { ChevronDown } from "lucide-react";
import RoleDropdownMenu from "./RoleDropdownMenu";

export default function ChangeRoleDropdown({ user }) {
	const [isDropdownOpen, setDropdownOpen] = useState(false);
	const [selectedRole, setSelectedRole] = useState(null);
	const [isModalOpen, setModalOpen] = useState(false);
	const [isLoading, setLoading] = useState(false);

	// Placeholder mutation function
	const changeRoleMutation = async (userId, role) => {
		console.log("Changing role for", userId, "to", role);
		await new Promise((r) => setTimeout(r, 1000));
		return true;
	};

	const handleSelectRole = (role) => {
		if (role === user.role) return;
		setSelectedRole(role);
		setModalOpen(true);
		setDropdownOpen(false);
	};

	const handleConfirm = async () => {
		setLoading(true);
		try {
			await changeRoleMutation(user.id, selectedRole);
			console.log("Role updated!");
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
			setModalOpen(false);
		}
	};

	if (user.role === Role.ADMIN) {
		return <StatusBadge status={user.role} size="sm" />;
	}

	return (
		<div className="relative inline-block text-left">
			<button
				onClick={() => setDropdownOpen((prev) => !prev)}
				className="inline-flex items-center gap-1 px-2 py-1 rounded-md border border-gray-200 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1">
				<StatusBadge status={user.role} size="sm" />
				<ChevronDown className="w-4 h-4 text-gray-400" />
			</button>

			{isDropdownOpen && (
				<RoleDropdownMenu
					currentRole={user.role}
					onSelect={handleSelectRole}
				/>
			)}

			{isModalOpen && (
				<ConfirmationModal
					title={`Change role to ${selectedRole}?`}
					variant="primary"
					confirmText="Change Role"
					isLoading={isLoading}
					onConfirm={handleConfirm}
					onCancel={() => setModalOpen(false)}>
					<p className="leading-6">
						Are you sure you want to change{" "}
						<strong>{user.name}</strong> from{" "}
						<strong>{user.role}</strong> to{" "}
						<strong>{selectedRole}</strong>?
					</p>
				</ConfirmationModal>
			)}
		</div>
	);
}
