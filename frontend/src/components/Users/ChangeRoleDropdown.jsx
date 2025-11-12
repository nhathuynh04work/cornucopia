import * as Popover from "@radix-ui/react-popover";
import { useState } from "react";
import { Role } from "@/lib/constants";
import StatusBadge from "../StatusBadge";
import ConfirmationModal from "../ConfirmationModal";
import { ChevronDown } from "lucide-react";
import RoleDropdownMenu from "./RoleDropdownMenu";
import { useUpdateRole } from "@/hooks/useUserMutation";
import toast from "react-hot-toast";

export default function ChangeRoleDropdown({ user }) {
	const [selectedRole, setSelectedRole] = useState(null);
	const [isModalOpen, setModalOpen] = useState(false);

	const { mutate: updateRole, isPending } = useUpdateRole();

	const handleSelectRole = (role) => {
		if (role === user.role) return;
		setSelectedRole(role);
		setModalOpen(true); // open modal
	};

	function handleConfirm() {
		updateRole(
			{ userId: user.id, role: selectedRole },
			{
				onSuccess: () => {
					toast.success("Role updated");
					setModalOpen(false);
				},
				onError: (err) => {
					toast.error(err.message || "Failed to update role");
				},
			}
		);
	}

	if (user.role === Role.ADMIN) {
		return <StatusBadge status={user.role} size="sm" />;
	}

	return (
		<>
			<Popover.Root>
				<Popover.Trigger asChild>
					<button
						disabled={isPending}
						className="inline-flex items-center gap-1 px-2 py-1 rounded-md border border-gray-200 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1">
						<StatusBadge status={user.role} size="sm" />
						<ChevronDown className="w-4 h-4 text-gray-400" />
					</button>
				</Popover.Trigger>

				{!isModalOpen && (
					<Popover.Portal>
						<Popover.Content
							side="bottom"
							sideOffset={4}
							align="end"
							className="z-50 w-36 rounded-md border border-gray-200 bg-white shadow-lg">
							<RoleDropdownMenu
								currentRole={user.role}
								onSelect={handleSelectRole}
							/>
							<Popover.Arrow className="fill-white" />
						</Popover.Content>
					</Popover.Portal>
				)}
			</Popover.Root>

			{isModalOpen && (
				<ConfirmationModal
					title={`Change role to ${selectedRole}?`}
					variant="primary"
					confirmText="Change Role"
					isLoading={isPending}
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
		</>
	);
}
