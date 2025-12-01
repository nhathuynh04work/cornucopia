import { useState, useEffect } from "react";
import { Users as UsersIcon, Loader2, AlertCircle, Search } from "lucide-react";

import { useGetUsers } from "@/hooks/useUserQuery";
import { useResourceFilters } from "@/hooks/useResourceFilters";

import PageHeader from "@/components/Shared/PageHeader";
import PaginationControl from "@/components/Shared/PaginationControl";
import EmptyState from "@/components/Shared/EmptyState";
import UsersFilterBar from "@/components/Users/UsersFilterBar";
import UsersTable from "@/components/Users/UsersTable";

export default function Users() {
	const { searchTerm, setSearchTerm, debouncedSearch } = useResourceFilters();

	const [page, setPage] = useState(1);
	const [roleFilter, setRoleFilter] = useState("ALL");
	const [statusFilter, setStatusFilter] = useState("ALL");

	// Reset page when filters change
	useEffect(() => {
		setPage(1);
	}, [debouncedSearch, roleFilter, statusFilter]);

	const isBlockedParam =
		statusFilter === "BLOCKED"
			? true
			: statusFilter === "ACTIVE"
			? false
			: undefined;

	const { data, isPending, isError, refetch } = useGetUsers({
		page,
		limit: 10,
		search: debouncedSearch,
		role: roleFilter === "ALL" ? undefined : roleFilter,
		isBlocked: isBlockedParam,
	});

	const users = data?.users || [];
	const totalPages = data?.totalPages || 1;
	const totalUsers = data?.total || 0;

	const renderContent = () => {
		if (isPending) {
			return (
				<div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
					<Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
					<p className="text-gray-500 font-medium animate-pulse">
						Đang tải danh sách người dùng...
					</p>
				</div>
			);
		}

		if (isError) {
			return (
				<div className="flex flex-col items-center justify-center min-h-[400px] bg-red-50/50 rounded-2xl border border-red-100 gap-4">
					<div className="p-3 bg-red-100 rounded-full text-red-600">
						<AlertCircle className="w-8 h-8" />
					</div>
					<div className="text-center">
						<h3 className="text-lg font-bold text-gray-900">
							Đã xảy ra lỗi
						</h3>
						<p className="text-gray-500 max-w-md mx-auto mt-1">
							Không thể tải dữ liệu người dùng. Vui lòng kiểm tra
							kết nối và thử lại.
						</p>
					</div>
					<button
						onClick={() => refetch()}
						className="px-4 py-2 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm">
						Thử lại
					</button>
				</div>
			);
		}

		if (users.length === 0) {
			return (
				<div className="bg-white border border-gray-200 rounded-2xl shadow-sm min-h-[400px] flex items-center justify-center">
					<EmptyState
						icon={UsersIcon}
						title="Không tìm thấy người dùng"
						description={
							searchTerm
								? `Không tìm thấy kết quả cho "${searchTerm}"`
								: "Chưa có người dùng nào khớp với bộ lọc hiện tại."
						}
					/>
				</div>
			);
		}

		return (
			<div className="space-y-4">
				<UsersTable users={users} />

				{totalPages > 1 && (
					<div className="border-t border-gray-100 pt-4">
						<PaginationControl
							currentPage={page}
							totalPages={totalPages}
							onPageChange={setPage}
						/>
					</div>
				)}
			</div>
		);
	};

	return (
		<div className="p-6 max-w-[1600px] mx-auto min-h-screen">
			{/* Header Section */}
			<div className="mb-8">
				<PageHeader
					title="Quản lý Người dùng"
					description="Quản lý tài khoản, phân quyền và trạng thái hoạt động của thành viên."
				/>
			</div>

			{/* Filter Section */}
			<div className="mb-6">
				<UsersFilterBar
					searchTerm={searchTerm}
					setSearchTerm={setSearchTerm}
					roleFilter={roleFilter}
					setRoleFilter={setRoleFilter}
					statusFilter={statusFilter}
					setStatusFilter={setStatusFilter}
					totalUsers={totalUsers}
					isPending={isPending}
					setPage={setPage}
				/>
			</div>

			{/* Content Section */}
			<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
				{renderContent()}
			</div>
		</div>
	);
}
