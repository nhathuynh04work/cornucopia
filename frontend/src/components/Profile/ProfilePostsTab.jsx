import { useState } from "react";
import { useGetPosts } from "@/hooks/usePostQuery";
import PostCard from "@/components/Posts/PostCard";
import PaginationControl from "@/components/Shared/PaginationControl";
import EmptyState from "@/components/Shared/EmptyState";
import { FileText, Loader2 } from "lucide-react";

export default function ProfilePostsTab({ userId, searchTerm, sortBy }) {
	const [page, setPage] = useState(1);
	const limit = 10;

	const { data, isLoading } = useGetPosts({
		authorId: userId,
		search: searchTerm,
		sort: sortBy,
		page,
		limit,
	});

	if (isLoading) {
		return (
			<div className="flex justify-center py-12">
				<Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
			</div>
		);
	}

	const items = data?.data || data || [];
	const pagination =data?.pagination || { totalPages: 1, currentPage: 1 };
	const totalPages = pagination.totalPages || Math.ceil(items.length / limit) || 1;

	if (items.length === 0) {
		return <EmptyState icon={FileText} message="Chưa có bài viết nào." />;
	}

	return (
		<div className="space-y-6">
			<div className="flex flex-col gap-4">
				{items.map((post) => (
					<div
						key={post.id}
						className="w-full relative group animate-in fade-in slide-in-from-bottom-2 duration-300">
						<PostCard post={post} />
					</div>
				))}
			</div>

			{totalPages > 1 && (
				<PaginationControl
					currentPage={page}
					totalPages={totalPages}
					onPageChange={setPage}
				/>
			)}
		</div>
	);
}
