import { Search } from "lucide-react";
import RadixSelect from "@/components/Shared/RadixSelect";

const roleOptions = [
	{ value: "ALL", label: "Tất cả vai trò" },
	{ value: "ADMIN", label: "Admin (Quản trị)" },
	{ value: "CREATOR", label: "Creator (Sáng tạo)" },
	{ value: "USER", label: "User (Học viên)" },
];

const statusOptions = [
	{ value: "ALL", label: "Tất cả trạng thái" },
	{ value: "ACTIVE", label: "Đang hoạt động" },
	{ value: "BLOCKED", label: "Đã bị chặn" },
];

export default function UsersFilterBar({
	searchTerm,
	setSearchTerm,
	roleFilter,
	setRoleFilter,
	statusFilter,
	setStatusFilter,
	totalUsers,
	isPending,
	setPage,
}) {
	return (
		<div className="flex flex-col-reverse md:flex-row justify-between items-start md:items-center gap-4 mb-6">
			{/* LEFT: Filters */}
			<div className="flex flex-wrap gap-3 w-full md:w-auto">
				<RadixSelect
					value={roleFilter}
					onChange={(val) => {
						setRoleFilter(val);
						setPage(1);
					}}
					options={roleOptions}
					className="w-[180px]"
				/>

				<RadixSelect
					value={statusFilter}
					onChange={(val) => {
						setStatusFilter(val);
						setPage(1);
					}}
					options={statusOptions}
					className="w-[180px]"
				/>
			</div>

			{/* RIGHT: Search + Count */}
			<div className="flex items-center gap-4 w-full md:w-auto justify-end">
				{!isPending && (
					<span className="hidden md:inline-block text-sm text-gray-500 whitespace-nowrap animate-in fade-in">
						Tìm thấy{" "}
						<strong className="text-gray-900">{totalUsers}</strong>{" "}
						người dùng
					</span>
				)}

				<div className="relative flex-1 md:w-64">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
					<input
						type="text"
						placeholder="Tìm kiếm..."
						value={searchTerm}
						onChange={(e) => {
							setSearchTerm(e.target.value);
							setPage(1);
						}}
						className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all shadow-sm"
					/>
				</div>
			</div>
		</div>
	);
}
