import * as Popover from "@radix-ui/react-popover";
import { useState } from "react";
import { MoreVertical, Ban, CheckCircle, Shield, Lock } from "lucide-react";
import toast from "react-hot-toast";
import { useUpdateUser } from "@/hooks/useUserMutation";
import ConfirmationModal from "@/components/Shared/ConfirmationModal";

export default function UserActionsMenu({ user }) {
	const [isOpen, setIsOpen] = useState(false);
	const [actionType, setActionType] = useState(null);
	const [pendingRole, setPendingRole] = useState(null);

	const { mutate: updateUser, isPending } = useUpdateUser();

	if (user.role === "ADMIN") {
		return (
			<div
				className="p-2 flex justify-end"
				title="Không thể chỉnh sửa Quản trị viên">
				<Shield className="w-4 h-4 text-gray-300" />
			</div>
		);
	}

	const handleRoleSelect = (role) => {
		if (role === user.role) return;
		setPendingRole(role);
		setActionType("ROLE_CHANGE");
		setIsOpen(false);
	};

	const handleStatusToggle = () => {
		setActionType("TOGGLE_STATUS");
		setIsOpen(false);
	};

	const handleConfirm = () => {
		if (actionType === "ROLE_CHANGE") {
			updateUser(
				{ userId: user.id, role: pendingRole },
				{
					onSuccess: () =>
						toast.success(
							`Đã cập nhật vai trò thành ${pendingRole}`
						),
				}
			);
		} else if (actionType === "TOGGLE_STATUS") {
			const newStatus = !user.isBlocked;
			updateUser(
				{ userId: user.id, isBlocked: newStatus },
				{
					onSuccess: () =>
						toast.success(
							newStatus
								? "Đã chặn người dùng"
								: "Đã kích hoạt lại"
						),
				}
			);
		}
		resetState();
	};

	const resetState = () => {
		setIsOpen(false);
		setActionType(null);
		setPendingRole(null);
	};

	return (
		<>
			<Popover.Root open={isOpen} onOpenChange={setIsOpen}>
				<Popover.Trigger asChild>
					<button className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors outline-none focus:ring-2 focus:ring-purple-100">
						<MoreVertical className="w-4 h-4" />
					</button>
				</Popover.Trigger>

				<Popover.Portal>
					<Popover.Content
						side="bottom"
						align="end"
						sideOffset={5}
						className="w-56 bg-white rounded-xl shadow-xl border border-gray-100 p-1.5 z-50 animate-in fade-in zoom-in-95 duration-200">
						{/* Roles Section */}
						<div className="space-y-0.5 border-b border-gray-100 pb-1.5 mb-1.5">
							<div className="px-2 py-1.5 flex items-center justify-between">
								<p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
									Đổi vai trò
								</p>
								{user.isBlocked && (
									<Lock
										className="w-3 h-3 text-red-300"
										title="Không thể đổi vai trò khi bị chặn"
									/>
								)}
							</div>

							{["ADMIN", "CREATOR", "USER"].map((role) => (
								<button
									key={role}
									disabled={isPending || user.isBlocked}
									onClick={() => handleRoleSelect(role)}
									className={`w-full flex items-center justify-between px-2 py-2 text-sm rounded-lg transition-colors ${
										user.role === role
											? "bg-purple-50 text-purple-700 font-bold"
											: "text-gray-700 hover:bg-gray-50 font-medium"
									} ${
										user.isBlocked
											? "opacity-50 cursor-not-allowed"
											: ""
									}`}>
									<span>{role}</span>
									{user.role === role && (
										<CheckCircle className="w-3.5 h-3.5" />
									)}
								</button>
							))}
						</div>

						{/* Actions Section */}
						<div className="space-y-0.5">
							<p className="px-2 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
								Hành động
							</p>
							<button
								disabled={isPending}
								onClick={handleStatusToggle}
								className={`w-full flex items-center gap-2 px-2 py-2 text-sm rounded-lg transition-colors font-medium ${
									user.isBlocked
										? "text-green-600 hover:bg-green-50"
										: "text-red-600 hover:bg-red-50"
								}`}>
								{user.isBlocked ? (
									<>
										<CheckCircle className="w-4 h-4" /> Bỏ
										chặn (Unban)
									</>
								) : (
									<>
										<Ban className="w-4 h-4" /> Chặn tài
										khoản
									</>
								)}
							</button>
						</div>
					</Popover.Content>
				</Popover.Portal>
			</Popover.Root>

			{/* Confirmation Modal */}
			{actionType && (
				<ConfirmationModal
					title={
						actionType === "ROLE_CHANGE"
							? "Thay đổi vai trò?"
							: user.isBlocked
							? "Kích hoạt lại?"
							: "Chặn người dùng?"
					}
					variant={
						actionType === "ROLE_CHANGE" || user.isBlocked
							? "primary"
							: "danger"
					}
					confirmText="Xác nhận"
					isLoading={isPending}
					onConfirm={handleConfirm}
					onCancel={resetState}>
					<div className="text-left space-y-2">
						{actionType === "ROLE_CHANGE" ? (
							<p>
								Bạn có chắc muốn thay đổi vai trò của{" "}
								<strong>{user.name}</strong> từ{" "}
								<span className="font-bold text-gray-700">
									{user.role}
								</span>{" "}
								sang{" "}
								<span className="font-bold text-purple-600">
									{pendingRole}
								</span>
								?
							</p>
						) : user.isBlocked ? (
							<p>
								Bạn có chắc muốn bỏ chặn{" "}
								<strong>{user.name}</strong>? Họ sẽ có thể đăng
								nhập lại bình thường.
							</p>
						) : (
							<p>
								Bạn có chắc muốn chặn{" "}
								<strong>{user.name}</strong>? Họ sẽ bị đăng xuất
								ngay lập tức và không thể truy cập vào hệ thống.
							</p>
						)}
					</div>
				</ConfirmationModal>
			)}
		</>
	);
}
