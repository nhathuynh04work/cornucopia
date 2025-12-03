import { useState } from "react";
import { Link } from "react-router-dom";
import {
	Mail,
	ChevronRight,
	Shield,
	Calendar,
	User,
	UserCog,
} from "lucide-react";
import toast from "react-hot-toast";

import { useUpdateUser } from "@/hooks/useUserMutation";
import { formatVNDate } from "@/lib/formatters";
import Avatar from "@/components/Shared/Avatar";
import RadixSelect from "@/components/Shared/RadixSelect";
import ConfirmationModal from "@/components/Shared/ConfirmationModal";

const ROLE_OPTIONS = [
	{ value: "ADMIN", label: "Quản trị viên" },
	{ value: "CREATOR", label: "Giảng viên" },
	{ value: "USER", label: "Học viên" },
];

const STATUS_OPTIONS = [
	{ value: "ACTIVE", label: "Hoạt động" },
	{ value: "BLOCKED", label: "Đã chặn" },
];

export default function UsersTable({ users }) {
	const [modalConfig, setModalConfig] = useState({
		isOpen: false,
		type: null,
		user: null,
		newValue: null,
	});

	const { mutate: updateUser, isPending } = useUpdateUser();

	const handleRoleChange = (user, newRole) => {
		if (user.role === newRole) return;
		setModalConfig({
			isOpen: true,
			type: "ROLE",
			user,
			newValue: newRole,
		});
	};

	const handleStatusChange = (user, newStatusValue) => {
		const isBlocked = newStatusValue === "BLOCKED";
		if (user.isBlocked === isBlocked) return;

		setModalConfig({
			isOpen: true,
			type: "STATUS",
			user,
			newValue: isBlocked,
		});
	};

	const handleConfirm = () => {
		const { type, user, newValue } = modalConfig;
		if (!user) return;

		const payload = { userId: user.id };
		let successMessage = "";

		if (type === "ROLE") {
			payload.role = newValue;
			successMessage = `Đã cập nhật vai trò của ${user.name} thành ${newValue}`;
		} else if (type === "STATUS") {
			payload.isBlocked = newValue;
			successMessage = newValue
				? `Đã chặn tài khoản ${user.name}`
				: `Đã mở khóa tài khoản ${user.name}`;
		}

		updateUser(payload, {
			onSuccess: () => {
				toast.success(successMessage);
				closeModal();
			},
			onError: () => {
				toast.error("Cập nhật thất bại. Vui lòng thử lại.");
				closeModal();
			},
		});
	};

	const closeModal = () => {
		setModalConfig({
			isOpen: false,
			type: null,
			user: null,
			newValue: null,
		});
	};

	const getStatusColor = (status) => {
		return status === "ACTIVE" ? "text-green-600" : "text-red-600";
	};

	// --- RENDER HELPERS ---

	const renderUserCardMobile = (user) => {
		const isAdmin = user.role === "ADMIN";
		const currentStatus = user.isBlocked ? "BLOCKED" : "ACTIVE";

		return (
			<div
				key={user.id}
				className={`bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4 ${
					user.isBlocked ? "bg-red-50/20" : ""
				}`}>
				{/* Header: Avatar, Name, Email */}
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3 overflow-hidden">
						<Avatar url={user.avatarUrl} name={user.name} />
						<div className="min-w-0">
							<div className="font-bold text-gray-900 text-sm truncate">
								{user.name}
							</div>
							<div className="text-xs text-gray-500 font-medium flex items-center gap-1 truncate">
								<Mail className="w-3 h-3 flex-shrink-0" />{" "}
								{user.email}
							</div>
						</div>
					</div>
					<Link
						to={`/profile/${user.id}`}
						className="p-2 -mr-2 text-gray-400 hover:text-purple-600">
						<ChevronRight className="w-5 h-5" />
					</Link>
				</div>

				<div className="h-px bg-gray-50 w-full" />

				{/* Controls Grid */}
				<div className="grid grid-cols-2 gap-3">
					<div className="space-y-1.5">
						<label className="text-[10px] uppercase font-bold text-gray-400 flex items-center gap-1">
							<UserCog className="w-3 h-3" /> Vai trò
						</label>
						{isAdmin ? (
							<div className="flex items-center gap-1.5 text-xs font-bold text-gray-400 py-2 px-1">
								<Shield className="w-3.5 h-3.5" />
								ADMIN
							</div>
						) : (
							<RadixSelect
								value={user.role}
								options={ROLE_OPTIONS}
								onChange={(val) => handleRoleChange(user, val)}
								className="w-full text-xs"
							/>
						)}
					</div>

					<div className="space-y-1.5">
						<label className="text-[10px] uppercase font-bold text-gray-400 flex items-center gap-1">
							<Shield className="w-3 h-3" /> Trạng thái
						</label>
						{isAdmin ? (
							<div className="flex items-center gap-1.5 text-xs font-bold text-green-600 py-2 px-1">
								Hoạt động
							</div>
						) : (
							<RadixSelect
								value={currentStatus}
								options={STATUS_OPTIONS}
								onChange={(val) =>
									handleStatusChange(user, val)
								}
								className={`w-full text-xs font-bold ${getStatusColor(
									currentStatus
								)}`}
							/>
						)}
					</div>
				</div>

				{/* Footer: Date */}
				<div className="flex items-center gap-1.5 text-xs text-gray-400 pt-1">
					<Calendar className="w-3.5 h-3.5" />
					<span>Tham gia: {formatVNDate(user.createdAt)}</span>
				</div>
			</div>
		);
	};

	return (
		<>
			{/* DESKTOP VIEW: Table */}
			<div className="hidden md:block bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden min-h-[400px]">
				<div className="overflow-x-auto">
					<table className="w-full text-left border-collapse">
						<thead className="bg-gray-50/50 border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold tracking-wider">
							<tr>
								<th className="px-6 py-4">Người dùng</th>
								<th className="px-6 py-4 w-48">Vai trò</th>
								<th className="px-6 py-4 w-40">Trạng thái</th>
								<th className="px-6 py-4">Ngày tham gia</th>
								<th className="px-6 py-4 text-right w-16"></th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-50">
							{users.map((user) => {
								const isAdmin = user.role === "ADMIN";
								const currentStatus = user.isBlocked
									? "BLOCKED"
									: "ACTIVE";

								return (
									<tr
										key={user.id}
										className={`group transition-colors ${
											user.isBlocked
												? "bg-red-50/30"
												: "hover:bg-gray-50"
										}`}>
										{/* User Info */}
										<td className="px-6 py-4">
											<div
												className={`flex items-center gap-3 ${
													user.isBlocked &&
													"opacity-60"
												}`}>
												<Avatar
													url={user.avatarUrl}
													name={user.name}
												/>
												<div>
													<div className="font-bold text-gray-900 text-sm">
														{user.name}
													</div>
													<div className="text-xs text-gray-500 font-medium flex items-center gap-1">
														<Mail className="w-3 h-3" />{" "}
														{user.email}
													</div>
												</div>
											</div>
										</td>

										{/* Role Selector */}
										<td className="px-6 py-4">
											{isAdmin ? (
												<div
													className="flex items-center gap-2 text-xs font-bold text-gray-400 px-3 py-2 bg-gray-100 rounded-xl w-fit"
													title="Không thể thay đổi quyền Quản trị viên">
													<Shield className="w-3.5 h-3.5" />
													ADMIN
												</div>
											) : (
												<RadixSelect
													value={user.role}
													options={ROLE_OPTIONS}
													onChange={(val) =>
														handleRoleChange(
															user,
															val
														)
													}
													className="w-full text-xs"
												/>
											)}
										</td>

										{/* Status Selector */}
										<td className="px-6 py-4">
											{isAdmin ? (
												<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-100">
													Hoạt động
												</span>
											) : (
												<RadixSelect
													value={currentStatus}
													options={STATUS_OPTIONS}
													onChange={(val) =>
														handleStatusChange(
															user,
															val
														)
													}
													className={`w-full text-xs font-bold ${getStatusColor(
														currentStatus
													)}`}
												/>
											)}
										</td>

										{/* Date */}
										<td className="px-6 py-4 text-sm text-gray-500 font-medium">
											{formatVNDate(user.createdAt)}
										</td>

										{/* Navigation Action */}
										<td className="px-6 py-4 text-right">
											<Link
												to={`/profile/${user.id}`}
												className="inline-flex items-center justify-center p-2 rounded-full text-gray-400 hover:text-purple-600 hover:bg-purple-50 transition-all">
												<ChevronRight className="w-5 h-5" />
											</Link>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			</div>

			{/* MOBILE VIEW: Cards */}
			<div className="md:hidden space-y-4">
				{users.map(renderUserCardMobile)}
			</div>

			{/* Confirmation Modal */}
			{modalConfig.isOpen && (
				<ConfirmationModal
					title={
						modalConfig.type === "ROLE"
							? "Thay đổi vai trò?"
							: modalConfig.newValue
							? "Chặn tài khoản?"
							: "Mở khóa tài khoản?"
					}
					confirmText={isPending ? "Đang xử lý..." : "Xác nhận"}
					variant={
						modalConfig.type === "STATUS" && modalConfig.newValue
							? "danger"
							: "primary"
					}
					isLoading={isPending}
					onConfirm={handleConfirm}
					onCancel={closeModal}>
					<div className="text-sm text-gray-600 leading-relaxed">
						{modalConfig.type === "ROLE" ? (
							<p>
								Bạn có chắc chắn muốn thay đổi vai trò của{" "}
								<b>{modalConfig.user?.name}</b> thành{" "}
								<b className="text-purple-600">
									{
										ROLE_OPTIONS.find(
											(o) =>
												o.value === modalConfig.newValue
										)?.label
									}
								</b>
								?
							</p>
						) : (
							<p>
								{modalConfig.newValue ? (
									<>
										Bạn có chắc muốn <b>chặn</b> người dùng{" "}
										<b>{modalConfig.user?.name}</b>?<br />
										Họ sẽ bị đăng xuất ngay lập tức và không
										thể truy cập hệ thống.
									</>
								) : (
									<>
										Bạn có chắc muốn <b>bỏ chặn</b> người
										dùng <b>{modalConfig.user?.name}</b>?
										<br />
										Họ sẽ có thể đăng nhập và sử dụng dịch
										vụ bình thường.
									</>
								)}
							</p>
						)}
					</div>
				</ConfirmationModal>
			)}
		</>
	);
}
