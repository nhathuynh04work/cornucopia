import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import TestCard from "@/components/Tests/TestCard";
import TestFilterSidebar from "@/components/Tests/TestFilterSidebar";
import PermissionGate from "@/components/Shared/PermissionGate";
import PaginationControl from "@/components/Shared/PaginationControl";
import ResourcePageLayout from "@/layouts/ResourcePageLayout";
import EmptyState from "@/components/Shared/EmptyState";
import { PERMISSIONS } from "@/lib/constants/common";
import { useGetTests } from "@/hooks/useTestQuery";
import { useResourceFilters } from "@/hooks/useResourceFilters";
import toast from "react-hot-toast";
import { useCreateTest } from "@/hooks/useTestMutation";
import SEO from "@/components/Shared/SEO";

const SORT_OPTIONS = [
	{ value: "newest", label: "Mới nhất" },
	{ value: "attempts", label: "Lượt thi nhiều nhất" },
	{ value: "oldest", label: "Cũ nhất" },
];

export default function Tests() {
	const {
		searchTerm,
		setSearchTerm,
		debouncedSearch,
		sort,
		setSort,
		page,
		setPage,
		limit,
		filters,
		toggleFilterArray,
		clearFilters,
	} = useResourceFilters({ defaultSort: "newest", defaultLimit: 6 });

	const queryParams = useMemo(
		() => ({
			search: debouncedSearch,
			level: filters.level,
			language: filters.language,
			sort,
			page,
			limit,
			status: "PUBLIC"
		}),
		[debouncedSearch, filters, sort, page, limit]
	);

	const { data: testsData, isLoading } = useGetTests(queryParams);

	const pagination = testsData?.tests?.pagination || {
		totalItems: 0,
		totalPages: 1,
		currentPage: 1,
	};

	const testsList = testsData?.data || [];

	const emptyState = (
		<EmptyState
			icon={Search}
			title="Không tìm thấy kết quả"
			description="Không có đề thi nào phù hợp với bộ lọc hiện tại.">
			<button
				onClick={clearFilters}
				className="text-purple-600 font-bold hover:underline">
				Xóa tất cả bộ lọc
			</button>
		</EmptyState>
	);

	return (
		<>
			<ResourcePageLayout
				title="Thư viện đề thi"
				description="Hàng ngàn đề thi trắc nghiệm giúp bạn ôn luyện kiến thức hiệu quả."
				action={
					<PermissionGate allowedRoles={PERMISSIONS.CREATE_TEST}>
						<CreateButton />
					</PermissionGate>
				}
				searchTerm={searchTerm}
				onSearchChange={(e) => setSearchTerm(e.target.value)}
				searchPlaceholder="Tìm kiếm đề thi..."
				sort={sort}
				onSortChange={setSort}
				sortOptions={SORT_OPTIONS}
				totalItems={pagination.totalItems}
				itemLabel="đề thi"
				filterContent={
					<TestFilterSidebar
						filters={filters}
						toggleFilterArray={toggleFilterArray}
						clearFilters={clearFilters}
					/>
				}
				isLoading={isLoading}
				pagination={
					testsList.length > 0 && (
						<PaginationControl
							currentPage={pagination.currentPage}
							totalPages={pagination.totalPages}
							onPageChange={setPage}
						/>
					)
				}>
				{testsList.length > 0 ? (
					<div className="grid grid-cols-1 gap-4">
						{testsList.map((test) => (
							<div key={test.id}>
								<TestCard test={test} />
							</div>
						))}
					</div>
				) : (
					!isLoading && emptyState
				)}
			</ResourcePageLayout>

			<SEO title={"Bài thi | Cornucopia"}/>
		</>
	);
}

function CreateButton() {
	const navigate = useNavigate();
	const { mutate, isPending } = useCreateTest();

	const handleCreate = () => {
		mutate(
			{},
			{
				onSuccess: (test) => {
					toast.success("Tạo bài thi thành công!");
					navigate(`/tests/${test.id}/edit`);
				},
				onError: () => {
					toast.error("Tạo bài thi thất bại.");
				},
			}
		);
	};
	return (
		<button
			onClick={handleCreate}
			disabled={isPending}
			className="inline-flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl transition-colors shadow-sm hover:shadow">
			<Plus className={`w-4 h-4 ${isPending ? "animate-spin" : ""}`} />
			{isPending ? "Đang tạo..." : "Tạo bài thi"}
		</button>
	);
}
