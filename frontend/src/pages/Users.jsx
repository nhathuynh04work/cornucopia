import { useState, useEffect } from "react";
import { useGetUsers } from "@/hooks/useUserQuery";
import { Users as UsersIcon } from "lucide-react";
import UsersTable from "@/components/Users/UsersTable";
import PaginationNav from "@/components/Users/PaginationNav";
import PageHeader from "@/components/Shared/PageHeader";
import FilterBar from "@/components/Shared/FilterBar";
import ResourceList from "@/components/Shared/ResourceList";
import { useResourceFilters } from "@/hooks/useResourceFilters";

export default function Users() {
	const {
		searchTerm,
		setSearchTerm,
		debouncedSearch,
		scope: roleFilter,
		setScope: setRoleFilter,
	} = useResourceFilters({ defaultScope: "ALL" });

	const [page, setPage] = useState(1);

	// Reset page when search changes
	useEffect(() => {
		setPage(1);
	}, [debouncedSearch, roleFilter]);

	const effectiveRole = roleFilter === "ALL" ? undefined : roleFilter;

	const { data, isPending, isError } = useGetUsers({
		search: debouncedSearch,
		role: effectiveRole,
		page,
		limit: 10,
	});

	const users = data?.users || [];
	const totalPages = data?.totalPages || 1;
	const totalUsers = data?.total || 0;

	return (
		<div className="p-6 max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
			<PageHeader
				title="Quản lý Người dùng"
				description="Quản lý tài khoản, vai trò và quyền hạn của người dùng."
			/>

			<FilterBar
				searchTerm={searchTerm}
				onSearchChange={setSearchTerm}
				searchPlaceholder="Tìm kiếm theo tên hoặc email..."
				tabs={[
					{ label: "Tất cả", value: "ALL" },
					{ label: "Quản trị viên", value: "ADMIN" },
					{ label: "Người sáng tạo", value: "CREATOR" },
					{ label: "Học viên", value: "USER" },
				]}
				activeTab={roleFilter}
				onTabChange={setRoleFilter}
			/>

			<ResourceList
				isLoading={isPending}
				isError={isError}
				data={users}
				resourceName="người dùng"
				emptyState={{
					icon: UsersIcon,
					title: "Không tìm thấy người dùng",
					description:
						"Không có người dùng nào khớp với tiêu chí tìm kiếm.",
				}}>
				{/* Custom Table Children */}
				<div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
					<UsersTable users={users} />
					{totalPages > 1 && (
						<div className="p-4 border-t border-gray-100">
							<PaginationNav
								page={page}
								totalPages={totalPages}
								total={totalUsers}
								onPrev={() =>
									setPage((p) => Math.max(1, p - 1))
								}
								onNext={() =>
									setPage((p) => Math.min(totalPages, p + 1))
								}
							/>
						</div>
					)}
				</div>
			</ResourceList>
		</div>
	);
}
