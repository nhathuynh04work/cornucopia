import { Navigate } from "react-router";
import { useAuth } from "@/contexts/AuthContext";
import { Role } from "@/lib/constants";

import TopicsList from "@/components/Posts/TopicsList";
import PostsList from "@/components/Posts/PostsList";
import CreatePostButton from "@/components/Posts/CreatePostButton";

import { useAllPostsQuery, useMyPostsQuery } from "@/hooks/usePostQuery";
import { useDeletePostMutation } from "@/hooks/usePostMutation";

/* ============ SHARED LAYOUT ============ */
function PostsPageContainer({ children }) {
  return (
    <div className="grid grid-cols-8 grid-rows-5 gap-8">
      <div className="col-span-2">
        <TopicsList />
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
        <p className="p-6 text-center text-gray-500">Đang tải bài viết...</p>
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
  const isAdmin = role === Role.ADMIN;

  const {
    data: posts = [],
    isPending,
    isError,
  } = useMyPostsQuery({ enabled: canAccess });

  const { mutate: deletePost, isPending: isDeleting } = useDeletePostMutation();

  if (!canAccess) return <Navigate to="/blog/all" replace />;

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

  const nonDraftPosts = posts.filter(
    (p) => p.status?.toUpperCase() !== "DRAFT"
  );

  function handleDelete(id) {
    if (!window.confirm("Bạn có chắc chắn muốn xóa bài viết này?")) return;
    deletePost(id);
  }

  return (
    <PostsPageContainer>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Bài viết của bạn</h2>
        {isDeleting && (
          <span className="text-xs text-gray-400">Đang xóa bài viết...</span>
        )}
      </div>

      {/* Box chứa nút tạo + list */}
      <PostsList
        prependItem={isAdmin ? <CreatePostButton /> : null}
        posts={nonDraftPosts}
        isPending={false}
        emptyMessage="Bạn chưa có bài viết nào được xuất bản."
        searchEmptyMessage="Không tìm thấy bài viết phù hợp."
        canManage={isAdmin}
        onDeletePost={isAdmin ? handleDelete : undefined}
      />
    </PostsPageContainer>
  );
}

/* ============ MY DRAFTS ============ */
export function MyDrafts() {
  const { role } = useAuth();

  const canAccess = role === Role.ADMIN || role === Role.CREATOR;
  const isAdmin = role === Role.ADMIN;

  const {
    data: posts = [],
    isPending,
    isError,
  } = useMyPostsQuery({ enabled: canAccess });

  if (!canAccess) return <Navigate to="/blog/all" replace />;

  if (isPending) {
    return (
      <PostsPageContainer>
        <p className="p-6 text-center text-gray-500">Đang tải bản nháp...</p>
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
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Bản nháp</h2>
      </div>

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
