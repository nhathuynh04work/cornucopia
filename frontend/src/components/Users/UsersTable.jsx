import { Mail, Ban } from "lucide-react";
import { formatVNDate } from "@/lib/formatters";
import Avatar from "@/components/Shared/Avatar";
import StatusBadge from "@/components/Shared/StatusBadge";
import UserActionsMenu from "./UserActionsMenu";

export default function UsersTable({ users }) {
	return (
		<div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden min-h-[400px] flex flex-col">
			<div className="overflow-x-auto">
				<table className="w-full text-left border-collapse">
					<thead className="bg-gray-50/50 border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold tracking-wider">
						<tr>
							<th className="px-6 py-4">Người dùng</th>
							<th className="px-6 py-4">Vai trò</th>
							<th className="px-6 py-4">Trạng thái</th>
							<th className="px-6 py-4">Ngày tham gia</th>
							<th className="px-6 py-4 text-right">Hành động</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-50">
						{users.map((user) => (
							<tr
								key={user.id}
								className={`group transition-colors ${
									!user.isBlocked
										? "hover:bg-gray-50"
										: "bg-red-50/30"
								}`}>
								{/* User Info */}
								<td className="px-6 py-4">
									<div
										className={`flex items-center gap-3 ${
											user.isBlocked && "opacity-60"
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

								{/* Role */}
								<td className="px-6 py-4">
									<StatusBadge status={user.role} size="sm" />
								</td>

								{/* Status */}
								<td className="px-6 py-4">
									{user.isBlocked ? (
										<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-100">
											<Ban className="w-3 h-3" />
											Đã chặn
										</span>
									) : user.isActive ? (
										<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-100">
											<span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
											Hoạt động
										</span>
									) : (
										<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
											Chưa xác thực
										</span>
									)}
								</td>

								{/* Date */}
								<td className="px-6 py-4 text-sm text-gray-500 font-medium">
									{formatVNDate(user.createdAt)}
								</td>

								{/* Actions */}
								<td className="px-6 py-4 text-right">
									<UserActionsMenu user={user} />
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
