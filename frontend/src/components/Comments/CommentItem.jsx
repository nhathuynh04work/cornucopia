import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { useAuth } from "@/contexts/AuthContext";
import Avatar from "@/components/Shared/Avatar";
import CommentForm from "./CommentForm";

export default function CommentItem({
  comment,
  postId,
  onReply,
  onDelete,
  isReplying,
  isDeleting,
  rootCommentId = null,
}) {
  const { user } = useAuth();
  const [showReplyForm, setShowReplyForm] = useState(false);

  const isOwner = user?.id === comment.userId;
  const isRoot = comment.parentId === null;

  // Nếu là root thì parentId chính là nó, nếu là con thì lấy rootCommentId truyền xuống
  // Logic này giúp giữ cấu trúc phẳng 2 cấp
  const currentRootId =
    rootCommentId || (isRoot ? comment.id : comment.parentId);

  const replyPrefix = `@${comment.user?.name}\u200b `;

  const handleReplySubmit = (content, clearInput) => {
    // Luôn gửi parentId là ID của Comment Gốc (Level 1)
    onReply({ content, parentId: currentRootId }, () => {
      clearInput();
      setShowReplyForm(false);
    });
  };

  const renderContent = (content) => {
    // Regex bắt chuỗi bắt đầu bằng @Tên (cho phép tiếng Việt và khoảng trắng trong tên)
    const tagRegex = /^(@.*?\u200b)/;
    const match = content.match(tagRegex);

    if (match) {
      const fullTag = match[0];
      const tagName = fullTag.replace("@", "").replace("\u200b", "").trim();
      // Cắt bỏ phần tag khỏi nội dung gốc
      const restContent = content.substring(fullTag.length);

      return (
        <span>
          {/* Hiển thị tên đậm, có thể click được (nếu muốn mở profile) */}
          <span className="font-bold text-gray-900 hover:underline cursor-pointer mr-1">
            {tagName}
          </span>
          {/* Render phần còn lại của comment */}
          <span className="text-gray-800">{restContent}</span>
        </span>
      );
    }
    // Nếu không có tag thì render text bình thường
    return <span className="text-gray-800">{content}</span>;
  };

  return (
    <div className="group animate-in fade-in duration-300">
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="shrink-0">
          <Avatar
            url={comment.user?.avatarUrl}
            name={comment.user?.name}
            className="w-8 h-8 border border-gray-100"
          />
        </div>

        {/* Nội dung comment */}
        <div className="flex-1 space-y-1">
          {/* Bong bóng chat */}
          <div className="bg-gray-100/80 px-3 py-2 rounded-2xl inline-block">
            <div className="text-xs font-bold text-gray-900 mb-0.5">
              {comment.user?.name}
            </div>
            <div className="text-sm leading-relaxed whitespace-pre-wrap">
              {renderContent(comment.content)}
            </div>
          </div>

          {/* Action buttons (Thời gian, Trả lời, Xóa) */}
          <div className="flex items-center gap-4 pl-2">
            <span className="text-xs text-gray-500 font-medium">
              {formatDistanceToNow(new Date(comment.createdAt), {
                addSuffix: true,
                locale: vi,
              })}
            </span>

            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="text-xs font-bold text-gray-500 hover:text-gray-800 cursor-pointer transition-colors"
            >
              Trả lời
            </button>

            {isOwner && (
              <button
                onClick={() => onDelete(comment.id)}
                disabled={isDeleting}
                className="text-xs font-medium text-gray-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
              >
                Xóa
              </button>
            )}
          </div>

          {/* Form Reply - Chỉ hiện khi bấm nút Trả lời */}
          {showReplyForm && (
            <div className="mt-2">
              <CommentForm
                onSubmit={handleReplySubmit}
                isPending={isReplying}
                onCancel={() => setShowReplyForm(false)}
                autoFocus
                // Truyền prefix vào đây để input tự điền
                initialValue={replyPrefix}
                placeholder={`Trả lời ${comment.user?.name}...`}
              />
            </div>
          )}
        </div>
      </div>

      {/* Render comment con (Đệ quy) */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-2 ml-8 space-y-3 pl-2 border-l-2 border-gray-100">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              postId={postId}
              onReply={onReply}
              onDelete={onDelete}
              isReplying={isReplying}
              isDeleting={isDeleting}
              rootCommentId={currentRootId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
