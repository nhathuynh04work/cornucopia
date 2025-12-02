import { useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import PostHeader from "@/components/PostDetails/PostHeader";
import PostContent from "@/components/PostDetails/PostContent";
import OwnerActions from "@/components/PostDetails/OwnerActions";
import TableOfContents from "@/components/PostDetails/TableOfContents";
import PostSkeleton from "@/components/PostDetails/PostSkeleton";
import LoadPostError from "@/components/PostDetails/LoadPostError";
import CommentSection from "@/components/Comments/CommentSection";

import { useAuth } from "@/contexts/AuthContext";
import { useGetPostDetails } from "@/hooks/usePostQuery";
import { useDeletePost } from "@/hooks/usePostMutation";
import { processContent } from "@/lib/htmlProcessor";
import { getReadingTime } from "@/lib/getReadingTime";
import toast from "react-hot-toast";
import SEO from "@/components/Shared/SEO";

export default function PostDetails() {
	const navigate = useNavigate();
	const { user } = useAuth();
	const { postId } = useParams();

	const { data: post, isPending, isError, error } = useGetPostDetails(postId);
	const { mutate: deletePost, isPending: isDeleting } = useDeletePost();

	const isOwner = user?.id && post?.author?.id === user.id;

	const { html: processedHtml, headings } = useMemo(
		() =>
			post ? processContent(post.content) : { html: "", headings: [] },
		[post]
	);

	function handleDelete() {
		deletePost(
			{ id: postId },
			{
				onSuccess: () => {
					navigate("/posts");
					toast.success("Xoá bài viết thành công!");
				},
			}
		);
	}

	if (isPending) return <PostSkeleton />;
	if (isError) return <LoadPostError error={error} />;

	return (
		<>
			<div className="max-w-[1200px] mx-auto p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
				{/* Top Navigation */}
				<div className="mb-6">
					<Link
						to="/posts"
						className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors group">
						<ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
						Quay lại Blog
					</Link>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 relative">
					{/* --- LEFT COLUMN: CONTENT --- */}
					<main className="min-w-0">
						{/* Unified Article Card */}
						<div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 md:p-12">
							<PostHeader
								post={post}
								readTime={getReadingTime(post.content)}
							/>
							<PostContent
								post={post}
								htmlContent={processedHtml}
							/>
						</div>

						{/* --- COMMENT SECTION --- */}
						<div className="mt-8 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
							<CommentSection postId={post.id} />
						</div>
					</main>

					{/* --- RIGHT SIDEBAR: STICKY --- */}
					<aside className="hidden lg:block h-full">
						<div className="sticky top-6 space-y-6">
							{/* Owner Actions (Only visible to owner) */}
							{isOwner && (
								<OwnerActions
									postId={post.id}
									onDelete={handleDelete}
									isDeleting={isDeleting}
								/>
							)}

							{/* Table of Contents */}
							{headings.length > 0 && (
								<TableOfContents headings={headings} />
							)}
						</div>
					</aside>
				</div>
			</div>

			<SEO
				title={`Bài viết | ${post.title}`}
				description={`Bài viết | ${post.title}`}
			/>
		</>
	);
}
