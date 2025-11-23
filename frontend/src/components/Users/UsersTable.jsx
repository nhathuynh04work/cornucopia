import { Mail, UserCheck, MoreVertical, Shield } from "lucide-react";
import Avatar from "@/components/Avatar";
import ChangeRoleDropdown from "./ChangeRoleDropdown";

function UsersTable({ users }) {
	if (!users || users.length === 0) {
		return (
			<div className="p-12 text-center text-gray-500">
				Không tìm thấy người dùng nào.
			</div>
		);
	}

	return (
		<div className="overflow-x-auto">
			<table className="w-full text-left text-sm">
				<thead className="bg-gray-50 border-b border-gray-100">
					<tr>
						<th className="px-6 py-4 font-semibold text-gray-900">
							Người dùng
						</th>
						<th className="px-6 py-4 font-semibold text-gray-900">
							Vai trò
						</th>
						<th className="px-6 py-4 font-semibold text-gray-900">
							Trạng thái
						</th>
						<th className="px-6 py-4 font-semibold text-gray-900">
							Ngày tham gia
						</th>
						<th className="px-6 py-4 font-semibold text-gray-900 text-right">
							Hành động
						</th>
					</tr>
				</thead>
				<tbody className="divide-y divide-gray-100 bg-white">
					{users.map((user) => (
						<tr
							key={user.id}
							className="hover:bg-gray-50/50 transition-colors group">
							<td className="px-6 py-4">
								<div className="flex items-center gap-3">
									<Avatar
										url={user.avatarUrl}
										name={user.name}
										size="sm"
									/>
									<div>
										<div className="font-bold text-gray-900">
											{user.name}
										</div>
										<div className="text-xs text-gray-500 flex items-center gap-1">
											<Mail className="w-3 h-3" />{" "}
											{user.email}
										</div>
									</div>
								</div>
							</td>

							<td className="px-6 py-4">
								<span
									className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${
										user.role === "ADMIN"
											? "bg-red-50 text-red-700 border-red-100"
											: user.role === "CREATOR"
											? "bg-purple-50 text-purple-700 border-purple-100"
											: "bg-gray-50 text-gray-700 border-gray-100"
									}`}>
									{user.role === "ADMIN" && (
										<Shield className="w-3 h-3" />
									)}
									{user.role}
								</span>
							</td>

							<td className="px-6 py-4">
								<span
									className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
										user.isActive
											? "bg-green-50 text-green-600"
											: "bg-orange-50 text-orange-600"
									}`}>
									<span
										className={`w-1.5 h-1.5 rounded-full ${
											user.isActive
												? "bg-green-500"
												: "bg-orange-500"
										}`}></span>
									{user.isActive ? "Hoạt động" : "Vô hiệu"}
								</span>
							</td>

							<td className="px-6 py-4 text-gray-500 font-medium">
								{new Date(user.createdAt).toLocaleDateString(
									"vi-VN"
								)}
							</td>

							<td className="px-6 py-4 text-right">
								{/* Using existing component for role change logic */}
								<ChangeRoleDropdown user={user} />
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

export default UsersTable;
