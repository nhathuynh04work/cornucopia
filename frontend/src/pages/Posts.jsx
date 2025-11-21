import { Navigate } from "react-router";
import { useAuth } from "@/contexts/AuthContext";
import { Role } from "@/lib/constants";

import TagsList from "@/components/Posts/TagsList";
import PostsList from "@/components/Posts/PostsList";
import CreatePostButton from "@/components/Posts/CreatePostButton";

import { useAllPostsQuery, useMyPostsQuery } from "@/hooks/usePostQuery";

/* ============ SHARED LAYOUT ============ */
function PostsPageContainer({ children }) {
	return (
		<div className="grid grid-cols-8 grid-rows-5 gap-8">
			<div className="col-span-2">
				<TagsList />
			</div>

			<div className="col-span-6 col-start-3">{children}</div>
		</div>
	);
}

/* ============ ALL POSTS ============ */
export function AllPosts() {
	const { data: posts = [], isPending, isError } = useAllPostsQuery();

	if (isPending) {
		return (
			<PostsPageContainer>
				<p className="p-6 text-center text-gray-500">
					Đang tải bài viết...
				</p>
			</PostsPageContainer>
		);
	}

	if (isError) {
		return (
			<PostsPageContainer>
				<p className="p-6 text-center text-red-500">
					Đã xảy ra lỗi khi tải bài viết.
				</p>
			</PostsPageContainer>
		);
	}

	return (
		<PostsPageContainer>
			<PostsList
				posts={posts}
				isPending={false}
				emptyMessage="Hiện chưa có bài viết public nào."
				searchEmptyMessage="Không tìm thấy bài viết phù hợp."
			/>
		</PostsPageContainer>
	);
}

/* ============ MY POSTS ============ */
export function MyPosts() {
	const { role } = useAuth();

	const canAccess = role === Role.ADMIN || role === Role.CREATOR;

	const { data: posts, isPending, isError } = useMyPostsQuery();

	if (!canAccess) return <Navigate to="/posts/all" replace />;

	if (isPending) {
		return (
			<PostsPageContainer>
				<p className="p-6 text-center text-gray-500">
					Đang tải bài viết của bạn...
				</p>
			</PostsPageContainer>
		);
	}

	if (isError) {
		return (
			<PostsPageContainer>
				<p className="p-6 text-center text-red-500">
					Đã xảy ra lỗi khi tải bài viết của bạn.
				</p>
			</PostsPageContainer>
		);
	}

	return (
		<PostsPageContainer>
			<PostsList
				prependItem={<CreatePostButton />}
				posts={posts}
				isPending={false}
				emptyMessage="Bạn chưa có bài viết nào được xuất bản."
				searchEmptyMessage="Không tìm thấy bài viết phù hợp."
			/>
		</PostsPageContainer>
	);
}

/* ============ MY DRAFTS ============ */
export function MyDrafts() {
	const { role } = useAuth();

	const canAccess = role === Role.ADMIN || role === Role.CREATOR;
	const isAdmin = role === Role.ADMIN;

	const { data: posts = [], isPending, isError } = useMyPostsQuery();

	if (!canAccess) return <Navigate to="/blog/all" replace />;

	if (isPending) {
		return (
			<PostsPageContainer>
				<p className="p-6 text-center text-gray-500">
					Đang tải bản nháp...
				</p>
			</PostsPageContainer>
		);
	}

	if (isError) {
		return (
			<PostsPageContainer>
				<p className="p-6 text-center text-red-500">
					Đã xảy ra lỗi khi tải bản nháp.
				</p>
			</PostsPageContainer>
		);
	}

	const drafts = posts.filter((p) => p.status?.toUpperCase() === "DRAFT");

	return (
		<PostsPageContainer>
			<PostsList
				prependItem={isAdmin ? <CreatePostButton /> : null}
				posts={drafts}
				isPending={false}
				emptyMessage="Bạn không có bản nháp nào."
				searchEmptyMessage="Không tìm thấy bản nháp phù hợp."
				canManage={isAdmin}
			/>
		</PostsPageContainer>
	);
}
