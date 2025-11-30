import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import PostCard from "@/components/Posts/PostCard";
import PostFilterSidebar from "@/components/Posts/PostFilterSidebar";
import PermissionGate from "@/components/Shared/PermissionGate";
import PaginationControl from "@/components/Shared/PaginationControl";
import ResourcePageLayout from "@/layouts/ResourcePageLayout";
import EmptyState from "@/components/Shared/EmptyState";
import { PERMISSIONS } from "@/lib/constants/common";
import { useGetPosts } from "@/hooks/usePostQuery";
import { useResourceFilters } from "@/hooks/useResourceFilters";
import { useCreatePost } from "@/hooks/usePostMutation";
import toast from "react-hot-toast";

const SORT_OPTIONS = [
	{ value: "newest", label: "Mới nhất" },
	{ value: "oldest", label: "Cũ nhất" },
];

export default function Posts() {
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
			tags: filters.tags,
			sort,
			page,
			limit,
			status: "PUBLIC",
		}),
		[debouncedSearch, filters, sort, page, limit]
	);

	const { data: postsData, isLoading } = useGetPosts(queryParams);

	const posts = postsData?.data || [];
	const pagination = postsData?.pagination || {
		totalItems: 0,
		totalPages: 1,
		currentPage: 1,
	};

	return (
		<ResourcePageLayout
			title="Bài viết & Chia sẻ"
			description="Cập nhật kiến thức, kinh nghiệm và mẹo học tập hữu ích từ cộng đồng."
			action={
				<PermissionGate allowedRoles={PERMISSIONS.CREATE_POST}>
					<CreateButton />
				</PermissionGate>
			}
			searchTerm={searchTerm}
			onSearchChange={(e) => setSearchTerm(e.target.value)}
			searchPlaceholder="Tìm kiếm bài viết..."
			sort={sort}
			onSortChange={setSort}
			sortOptions={SORT_OPTIONS}
			totalItems={pagination.totalItems}
			itemLabel="bài viết"
			filterContent={
				<PostFilterSidebar
					filters={filters}
					toggleFilterArray={toggleFilterArray}
					clearFilters={clearFilters}
				/>
			}
			isLoading={isLoading}
			pagination={
				posts.length > 0 && (
					<PaginationControl
						currentPage={pagination.currentPage}
						totalPages={pagination.totalPages}
						onPageChange={setPage}
					/>
				)
			}>
			{posts.length > 0 ? (
				<div className="grid grid-cols-1 gap-4">
					{posts.map((post) => (
						<div key={post.id}>
							<PostCard post={post} />
						</div>
					))}
				</div>
			) : (
				!isLoading && (
					<EmptyState
						icon={Search}
						title="Không tìm thấy kết quả"
						description="Không có bài viết nào phù hợp với bộ lọc hiện tại.">
						<button
							onClick={clearFilters}
							className="text-purple-600 font-bold hover:underline">
							Xóa tất cả bộ lọc
						</button>
					</EmptyState>
				)
			)}
		</ResourcePageLayout>
	);
}

function CreateButton() {
	const navigate = useNavigate();
	const { mutate, isPending } = useCreatePost();

	const handleCreate = () => {
		mutate(
			{},
			{
				onSuccess: (post) => {
					toast.success("Tạo bài viết thành công!");
					navigate(`/posts/${post.id}/edit`);
				},
				onError: () => {
					toast.error("Tạo bài viết thất bại.");
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
			{isPending ? "Đang tạo..." : "Tạo bài viết"}
		</button>
	);
}
