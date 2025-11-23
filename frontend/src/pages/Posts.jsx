import { useNavigate } from "react-router";
import { PenTool, FileText, Plus, Loader2, AlertCircle } from "lucide-react";
import { useGetPosts } from "@/hooks/usePostQuery";
import { useCreatePost } from "@/hooks/usePostMutation";
import PostCard from "@/components/Posts/PostCard";
import PermissionGate from "@/components/PermissionGate";
import { PERMISSIONS } from "@/lib/constants";
import toast from "react-hot-toast";
import PageHeader from "@/components/Shared/PageHeader";
import FilterBar from "@/components/Shared/FilterBar";
import EmptyState from "@/components/Shared/EmptyState";
import { useAuth } from "@/contexts/AuthContext";
import { useResourceFilters } from "@/hooks/useResourceFilters";

export default function Posts() {
	const { user } = useAuth();
	const navigate = useNavigate();

	const {
		searchTerm,
		setSearchTerm,
		debouncedSearch,
		sort,
		setSort,
		scope,
		setScope,
	} = useResourceFilters();

	const { mutate: createPost, isPending: isCreating } = useCreatePost();

	const queryParams = {
		search: debouncedSearch,
		sort,
		status: "PUBLIC",
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

	const renderContent = () => {
		if (isPending) {
			return (
				<div className="h-96 flex flex-col items-center justify-center text-gray-400">
					<Loader2 className="w-10 h-10 animate-spin mb-3 text-purple-500" />
					<p>Đang tải bài viết...</p>
				</div>
			);
		}

		if (isError) {
			return (
				<div className="h-96 flex flex-col items-center justify-center text-red-500 bg-red-50 rounded-2xl border border-red-100 p-8">
					<AlertCircle className="w-10 h-10 mb-3" />
					<p>Không thể tải danh sách bài viết.</p>
				</div>
			);
		}

		if (!posts || posts.length === 0) {
			return (
				<EmptyState
					icon={FileText}
					title="Chưa có bài viết nào"
					description="Hãy là người đầu tiên chia sẻ kiến thức với cộng đồng."
					actionLabel="Viết bài ngay"
					onAction={handleCreatePost}
					allowedRoles={PERMISSIONS.CREATE_POST}
				/>
			);
		}

		return (
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
				{posts.map((post) => (
					<PostCard key={post.id} post={post} />
				))}
			</div>
		);
	};

	const tabs = [{ label: "Tất cả", value: "ALL" }];
	if (user) {
		tabs.push({ label: "Bài viết của tôi", value: "MINE" });
	}

	return (
		<div className="p-6 max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
			<PageHeader
				title="Blog Cộng đồng"
				description="Đọc các bài viết, chia sẻ và kinh nghiệm từ cộng đồng Cornucopia."
				action={
					<PermissionGate allowedRoles={PERMISSIONS.CREATE_POST}>
						<button
							onClick={handleCreatePost}
							disabled={isCreating}
							className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-bold text-sm rounded-xl transition-colors shadow-sm hover:shadow disabled:opacity-70">
							{isCreating ? (
								<Loader2 className="w-4 h-4 animate-spin" />
							) : (
								<PenTool className="w-4 h-4" />
							)}
							Viết bài
						</button>
					</PermissionGate>
				}
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

			{renderContent()}
		</div>
	);
}
