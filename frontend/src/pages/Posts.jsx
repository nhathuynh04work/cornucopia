import { useNavigate, useSearchParams } from "react-router-dom";
import { PenTool, FileText, Plus, Loader2 } from "lucide-react";
import { useGetPosts } from "@/hooks/usePostQuery";
import { useCreatePost } from "@/hooks/usePostMutation";
import { useQuery } from "@tanstack/react-query";
import tagApi from "@/apis/tagApi";
import PostCard from "@/components/Posts/PostCard";
import TagFilter from "@/components/Posts/TagFilter";
import PermissionGate from "@/components/PermissionGate";
import { PERMISSIONS } from "@/lib/constants";
import toast from "react-hot-toast";
import PageHeader from "@/components/Shared/PageHeader";
import FilterBar from "@/components/Shared/FilterBar";
import EmptyState from "@/components/Shared/EmptyState";
import ResourceList from "@/components/Shared/ResourceList";
import { useAuth } from "@/contexts/AuthContext";
import { useResourceFilters } from "@/hooks/useResourceFilters";

export default function Posts() {
	const { user } = useAuth();
	const navigate = useNavigate();
	const [urlSearchParams, setUrlSearchParams] = useSearchParams();
	const activeTag = urlSearchParams.get("tag");

	const {
		searchTerm,
		setSearchTerm,
		debouncedSearch,
		sort,
		setSort,
		scope,
		setScope,
	} = useResourceFilters();

	const { data: tags } = useQuery({
		queryKey: ["tags"],
		queryFn: tagApi.getAll,
	});

	const { mutate: createPost, isPending: isCreating } = useCreatePost();

	const queryParams = {
		search: debouncedSearch,
		sort,
		status: scope === "MINE" ? undefined : "PUBLIC",
		tags: activeTag || undefined,
	};

	if (scope === "MINE" && user) {
		queryParams.authorId = user.id;
	}

	const { data: posts, isPending, isError } = useGetPosts(queryParams);

	const handleCreatePost = () => {
		createPost(
			{},
			{
				onSuccess: (post) => {
					toast.success("Đã tạo bản nháp! Đang chuyển hướng...");
					navigate(`/posts/${post.id}/edit`);
				},
			}
		);
	};

	const handleTagSelect = (tagName) => {
		if (tagName === null || activeTag === tagName) {
			const newParams = new URLSearchParams(urlSearchParams);
			newParams.delete("tag");
			setUrlSearchParams(newParams);
			return;
		}

		const newParams = new URLSearchParams(urlSearchParams);
		newParams.set("tag", tagName);
		setUrlSearchParams(newParams);
	};

	const tabs = [{ label: "Tất cả", value: "ALL" }];
	if (user) {
		tabs.push({ label: "Bài viết của tôi", value: "MINE" });
	}

	return (
		<div className="max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
			{/* Page Header */}
			<div className="px-6 pt-6">
				<PageHeader
					title="Blog Cộng đồng"
					description="Đọc các bài viết, chia sẻ và kinh nghiệm từ cộng đồng Cornucopia."
                    className={`!mb-4`}
					action={
						<PermissionGate allowedRoles={PERMISSIONS.CREATE_POST}>
							<button
								onClick={handleCreatePost}
								disabled={isCreating}
								className="inline-flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm rounded-xl transition-colors shadow-sm hover:shadow disabled:opacity-70">
								{isCreating ? (
									<Loader2 className="w-4 h-4 animate-spin" />
								) : (
									<Plus className="w-4 h-4" />
								)}
								Viết bài
							</button>
						</PermissionGate>
					}
				/>
			</div>

			{/* Sticky Filter Section */}
			<div className="sticky top-0 z-20 bg-gray-50/95 backdrop-blur-md px-6 pt-4 pb-2 transition-all duration-200">
				<TagFilter
					tags={tags}
					activeTag={activeTag}
					onSelect={handleTagSelect}
				/>

				<FilterBar
					searchTerm={searchTerm}
					onSearchChange={setSearchTerm}
					searchPlaceholder="Tìm kiếm bài viết..."
					tabs={tabs}
					activeTab={scope}
					onTabChange={setScope}
					sortOptions={[
						{ label: "Mới nhất", value: "newest" },
						{ label: "Cũ nhất", value: "oldest" },
					]}
					activeSort={sort}
					onSortChange={setSort}
				/>
			</div>

			{/* Scrollable Content */}
			<div className="px-6 pb-6 pt-4">
				<ResourceList
					isLoading={isPending}
					isError={isError}
					data={posts}
					resourceName="bài viết"
					gridCols="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
					renderItem={(post) => (
						<PostCard key={post.id} post={post} />
					)}
					emptyState={{
						icon: FileText,
						title: "Chưa có bài viết nào",
						description:
							"Hãy là người đầu tiên chia sẻ kiến thức với cộng đồng.",
						actionLabel: "Viết bài ngay",
						onAction: handleCreatePost,
						allowedRoles: PERMISSIONS.CREATE_POST,
					}}
				/>
			</div>
		</div>
	);
}
