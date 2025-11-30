import { useGetComments } from "@/hooks/useCommentQuery";
import { useCreateComment, useDeleteComment } from "@/hooks/useCommentMutation";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";
import { Loader2, MessageSquare } from "lucide-react";
import { useMemo } from "react";

export default function CommentSection({ postId, lessonId, testId }) {
  const entityParams = useMemo(() => {
    const params = {};
    if (postId) params.postId = postId;
    if (lessonId) params.lessonId = lessonId;
    if (testId) params.testId = testId;
    return params;
  }, [postId, lessonId, testId]);

  const { data, isPending } = useGetComments(entityParams);
  const { mutate: createComment, isPending: isCreating } = useCreateComment();
  const { mutate: deleteComment, isPending: isDeleting } = useDeleteComment();

  const comments = data?.comments || [];
  const totalComments = data?.metadata?.total || 0;

  const handleCreateComment = (content, callback) => {
    createComment({ content, ...entityParams }, { onSuccess: callback });
  };

  const handleReplyComment = ({ content, parentId }, callback) => {
    createComment(
      { content, parentId, ...entityParams },
      { onSuccess: callback }
    );
  };

  const handleDeleteComment = (id) => {
    if (confirm("Bạn có chắc chắn muốn xóa bình luận này không?")) {
      deleteComment({ id, ...entityParams }); // Truyền postId để hook biết context update cache
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 mt-8">
      <div className="flex items-center gap-2 mb-6">
        <h3 className="text-xl font-bold text-gray-900">Bình luận</h3>
        <div className="px-2 py-0.5 bg-gray-100 rounded-full text-xs font-medium text-gray-600">
          {totalComments}
        </div>
      </div>

      <div className="mb-8">
        <CommentForm onSubmit={handleCreateComment} isPending={isCreating} />
      </div>

      {isPending ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
        </div>
      ) : comments.length > 0 ? (
        <div className="space-y-6">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              postId={postId}
              lessonId={lessonId}
              testId={testId}
              onReply={handleReplyComment}
              onDelete={handleDeleteComment}
              isReplying={isCreating}
              isDeleting={isDeleting}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-400 flex flex-col items-center gap-2">
          <MessageSquare className="w-8 h-8 opacity-20" />
          <p className="text-sm">
            Chưa có bình luận nào. Hãy là người đầu tiên!
          </p>
        </div>
      )}
    </div>
  );
}
