import { useState, useMemo } from "react";
import { useGetComments } from "@/hooks/useCommentQuery";
import { useCreateComment, useDeleteComment } from "@/hooks/useCommentMutation";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";
import ConfirmationModal from "@/components/Shared/ConfirmationModal";
import { Loader2, MessageSquare } from "lucide-react";

export default function CommentSection({ postId, lessonId, testId }) {
	const entityParams = useMemo(() => {
		const params = {};
		if (postId) params.postId = postId;
		if (lessonId) params.lessonId = lessonId;
		if (testId) params.testId = testId;
		return params;
	}, [postId, lessonId, testId]);

	const [commentToDelete, setCommentToDelete] = useState(null);

	const { data, isPending } = useGetComments(entityParams);
	const { mutate: createComment, isPending: isCreating } = useCreateComment();
	const { mutate: deleteComment, isPending: isDeleting } = useDeleteComment();

	const comments = data?.comments || [];
	const totalComments = data?.pagination?.total || 0;

	const handleCreateComment = (content, callback) => {
		createComment({ content, ...entityParams }, { onSuccess: callback });
	};

	const handleReplyComment = ({ content, parentId }, callback) => {
		createComment(
			{ content, parentId, ...entityParams },
			{ onSuccess: callback }
		);
	};

	const handleDeleteClick = (id) => {
		setCommentToDelete(id);
	};

	const handleConfirmDelete = () => {
		if (commentToDelete) {
			deleteComment(
				{ id: commentToDelete, ...entityParams },
				{
					onSuccess: () => setCommentToDelete(null),
				}
			);
		}
	};

	return (
		<div className="animate-in fade-in duration-500 p-6 md:p-8">
			<div className="flex items-center justify-between mb-8">
				<div className="flex items-center gap-3">
					<h3 className="text-2xl font-bold text-gray-900">
						Bình luận
					</h3>
					<span className="px-2.5 py-0.5 bg-gray-100 rounded-full text-sm font-semibold text-gray-600">
						{totalComments}
					</span>
				</div>
			</div>

			<div className="mb-10">
				<CommentForm
					onSubmit={handleCreateComment}
					isPending={isCreating}
				/>
			</div>

			{isPending ? (
				<div className="flex justify-center py-12">
					<Loader2 className="w-8 h-8 animate-spin text-purple-600" />
				</div>
			) : comments.length > 0 ? (
				<div className="space-y-8">
					{comments.map((comment) => (
						<CommentItem
							key={comment.id}
							comment={comment}
							onReply={handleReplyComment}
							onDelete={handleDeleteClick}
							isReplying={isCreating}
							isDeleting={isDeleting}
						/>
					))}
				</div>
			) : (
				<div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-gray-100 rounded-3xl">
					<div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
						<MessageSquare className="w-6 h-6 text-gray-300" />
					</div>
					<p className="text-gray-500 font-medium">
						Chưa có bình luận nào. Hãy là người đầu tiên chia sẻ suy
						nghĩ!
					</p>
				</div>
			)}

			{/* Confirmation Modal */}
			{commentToDelete && (
				<ConfirmationModal
					title="Xóa bình luận"
					variant="danger"
					confirmText="Xóa ngay"
					isLoading={isDeleting}
					onConfirm={handleConfirmDelete}
					onCancel={() => setCommentToDelete(null)}>
					Bạn có chắc chắn muốn xóa bình luận này không? Hành động này
					không thể hoàn tác.
				</ConfirmationModal>
			)}
		</div>
	);
}
