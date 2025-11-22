import { useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { ArrowLeft, AlertCircle } from "lucide-react";
import PostHeader from "@/components/PostDetails/PostHeader";
import PostContent from "@/components/PostDetails/PostContent";
import AuthorCard from "@/components/PostDetails/AuthorCard";
import { getReadingTime } from "@/lib/getReadingTime";
import OwnerActions from "@/components/PostDetails/OwnerActions";
import TagsList from "@/components/PostDetails/TagsList";
import TableOfContents from "@/components/PostDetails/TableOfContents";
import { useAuth } from "@/contexts/AuthContext";
import { usePostDetailsQuery } from "@/hooks/usePostQuery";
import { processContent } from "@/lib/htmlProcessor";
import { useDeletePost } from "@/hooks/usePostMutation";
import toast from "react-hot-toast";
import PostSkeleton from "@/components/PostDetails/PostSkeleton";
import LoadPostError from "@/components/PostDetails/LoadPostError";

export default function PostDetails() {
	const navigate = useNavigate();
	const { user } = useAuth();
	const { id } = useParams();
	const { data: post, isPending, isError, error } = usePostDetailsQuery(id);
	const { mutate: deletePost, isPending: isDeleting } = useDeletePost();

	const isOwner = user?.id && post?.author?.id === user.id;

	const { html: processedHtml, headings } = useMemo(
		() =>
			post ? processContent(post.content) : { html: "", headings: [] },
		[post]
	);

	function handleDelete() {
		deletePost(
			{ id: id },
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
		<div className="w-5/6 mx-auto p-6">
			<div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12 relative">
				{/* --- LEFT COLUMN: CONTENT --- */}
				<main className="min-w-0">
					<PostHeader post={post} />
					<PostContent post={post} htmlContent={processedHtml} />
				</main>

				{/* --- RIGHT SIDEBAR: STICKY --- */}
				<aside className="hidden lg:block h-full space-y-8">
					{/* 1. Back Link */}
					<div>
						<Link
							to="/posts"
							className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors group">
							<ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
							Back to Blog
						</Link>
					</div>

					{/* 2. Author Card */}
					<AuthorCard
						author={post.author}
						publishedAt={post?.publishedAt ?? post.createdAt}
						readTime={getReadingTime(post.content)}
					/>

					{/* 3. Owner Actions */}
					{isOwner && (
						<OwnerActions
							postId={post.id}
							onDelete={handleDelete}
							isDeleting={isDeleting}
						/>
					)}

					{/* 4. Tags */}
					<TagsList tags={post.tags} />

					{/* 5. Table of Contents */}
					<TableOfContents headings={headings} />
				</aside>
			</div>
		</div>
	);
}
