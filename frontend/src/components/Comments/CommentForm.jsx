import { useState, useCallback } from "react";
import { Send, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import Avatar from "@/components/Shared/Avatar";

export default function CommentForm({
	onSubmit,
	isPending,
	initialValue = "",
	placeholder = "Viết bình luận...",
	onCancel,
	autoFocus = false,
}) {
	const [content, setContent] = useState(initialValue);
	const { user } = useAuth();

	const textareaRef = useCallback(
		(node) => {
			if (node && autoFocus) {
				node.focus();
				const length = node.value.length;
				node.setSelectionRange(length, length);
			}
		},
		[autoFocus]
	);

	if (!user) {
		return (
			<div className="bg-gray-50 p-4 rounded-xl text-center text-sm text-gray-500">
				Vui lòng{" "}
				<Link
					to="/login"
					className="text-purple-600 font-medium hover:underline">
					đăng nhập
				</Link>{" "}
				để bình luận.
			</div>
		);
	}

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!content.trim()) return;
		onSubmit(content, () => setContent(""));
	};

	const handleKeyDown = (e) => {
		if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
			handleSubmit(e);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="flex gap-4 items-start">
			<div className="mt-1 shrink-0">
				<Link to={`/profile/${user.id}`}>
					<Avatar url={user?.avatarUrl} name={user?.name} size="sm" />
				</Link>
			</div>
			<div className="flex-1 space-y-2">
				<textarea
					ref={textareaRef}
					value={content}
					onChange={(e) => setContent(e.target.value)}
					onKeyDown={handleKeyDown}
					placeholder={placeholder}
					className="w-full min-h-[80px] p-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none resize-none text-sm transition-all bg-white"
				/>
				<div className="flex justify-end gap-2">
					{onCancel && (
						<button
							type="button"
							onClick={onCancel}
							className="px-3 py-1.5 text-xs font-bold text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
							Hủy
						</button>
					)}
					<button
						type="submit"
						disabled={isPending || !content.trim()}
						className="inline-flex items-center gap-2 px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow">
						{isPending ? (
							<Loader2 className="w-3 h-3 animate-spin" />
						) : (
							<Send className="w-3 h-3" />
						)}
						{onCancel ? "Trả lời" : "Gửi bình luận"}
					</button>
				</div>
			</div>
		</form>
	);
}
