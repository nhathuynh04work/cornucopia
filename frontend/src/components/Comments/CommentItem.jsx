import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { useAuth } from "@/contexts/AuthContext";
import Avatar from "@/components/Shared/Avatar";
import CommentForm from "./CommentForm";
import { Link } from "react-router";

export default function CommentItem({
	comment,
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

	const currentRootId =
		rootCommentId || (isRoot ? comment.id : comment.parentId);

	const replyPrefix = `@${comment.user?.name}\u200b `;

	const handleReplySubmit = (content, clearInput) => {
		onReply({ content, parentId: currentRootId }, () => {
			clearInput();
			setShowReplyForm(false);
		});
	};

	const renderContent = (content) => {
		const tagRegex = /^(@.*?\u200b)/;
		const match = content.match(tagRegex);

		if (match) {
			const fullTag = match[0];
			const tagName = fullTag
				.replace("@", "")
				.replace("\u200b", "")
				.trim();
			const restContent = content.substring(fullTag.length);

			return (
				<span>
					<span className="font-bold text-gray-900 hover:underline cursor-pointer mr-1">
						{tagName}
					</span>
					<span className="text-gray-700">{restContent}</span>
				</span>
			);
		}
		return <span className="text-gray-700">{content}</span>;
	};

	return (
		<div className="group animate-in fade-in slide-in-from-bottom-2 duration-300">
			<div className="flex gap-4">
				<Link to={`/profile/${comment.user.id}`} className="shrink-0">
					<Avatar
						url={comment.user?.avatarUrl}
						name={comment.user?.name}
						size="sm"
					/>
				</Link>

				<div className="flex-1 min-w-0">
					<div className="bg-gray-50 hover:bg-gray-100/80 transition-colors px-4 py-3 rounded-2xl rounded-tl-none inline-block max-w-full">
						<div className="flex items-center gap-2 mb-1">
							<span className="text-sm font-bold text-gray-900">
								{comment.user?.name}
							</span>
							<span className="text-xs text-gray-400 font-medium">
								{formatDistanceToNow(
									new Date(comment.createdAt),
									{
										addSuffix: true,
										locale: vi,
									}
								)}
							</span>
						</div>
						<div className="text-sm leading-relaxed whitespace-pre-wrap break-words">
							{renderContent(comment.content)}
						</div>
					</div>

					<div className="flex items-center gap-4 mt-2 ml-1">
						<button
							onClick={() => setShowReplyForm(!showReplyForm)}
							className="text-xs font-semibold text-gray-500 hover:text-purple-600 transition-colors">
							Trả lời
						</button>

						{isOwner && (
							<button
								onClick={() => onDelete(comment.id)}
								disabled={isDeleting}
								className="text-xs font-semibold text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
								Xóa
							</button>
						)}
					</div>

					{showReplyForm && (
						<div className="mt-4 animate-in fade-in duration-200">
							<CommentForm
								onSubmit={handleReplySubmit}
								isPending={isReplying}
								onCancel={() => setShowReplyForm(false)}
								autoFocus
								initialValue={replyPrefix}
								placeholder={`Trả lời ${comment.user?.name}...`}
							/>
						</div>
					)}
				</div>
			</div>

			{/* Recursive Render for Replies */}
			{comment.replies && comment.replies.length > 0 && (
				<div className="mt-4 ml-10 space-y-6">
					{comment.replies.map((reply) => (
						<CommentItem
							key={reply.id}
							comment={reply}
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
