import { useState, useEffect } from "react";
import { Users as UsersIcon } from "lucide-react";

import { useGetUsers } from "@/hooks/useUserQuery";
import { useResourceFilters } from "@/hooks/useResourceFilters";

import PageHeader from "@/components/Shared/PageHeader";
import ResourceList from "@/components/Shared/ResourceList";
import PaginationControl from "@/components/Shared/PaginationControl";
import UsersFilterBar from "@/components/Users/UsersFilterBar";
import UsersTable from "@/components/Users/UsersTable";

export default function Users() {
	const { searchTerm, setSearchTerm, debouncedSearch } = useResourceFilters();

	const [page, setPage] = useState(1);
	const [roleFilter, setRoleFilter] = useState("ALL");
	const [statusFilter, setStatusFilter] = useState("ALL");

	useEffect(() => {
		setPage(1);
	}, [debouncedSearch, roleFilter, statusFilter]);

	const isBlockedParam =
		statusFilter === "BLOCKED"
			? true
			: statusFilter === "ACTIVE"
			? false
			: undefined;

	const { data, isPending, isError } = useGetUsers({
		page,
		limit: 10,
		search: debouncedSearch,
		role: roleFilter === "ALL" ? undefined : roleFilter,
		isBlocked: isBlockedParam,
	});

	const users = data?.users || [];
	const totalPages = data?.totalPages || 1;
	const totalUsers = data?.total || 0;

	return (
		<div className="p-6 max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
			<PageHeader
				title="Quản lý Người dùng"
				description="Quản lý tài khoản, phân quyền và trạng thái hoạt động."
			/>

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
				<div className="space-y-4">
					<UsersTable users={users} />

					{totalPages > 1 && (
						<div className="border-t border-gray-100 p-4 bg-white rounded-b-2xl">
							<PaginationControl
								currentPage={page}
								totalPages={totalPages}
								onPageChange={setPage}
							/>
						</div>
					)}
				</div>
			</ResourceList>
		</div>
	);
}
