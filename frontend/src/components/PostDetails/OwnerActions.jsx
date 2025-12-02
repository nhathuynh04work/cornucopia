import { Link } from "react-router-dom";
import { Edit3, Trash2, Loader2 } from "lucide-react";

export default function OwnerActions({ postId, onDelete, isDeleting }) {
	return (
		<div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm space-y-3">
			<h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
				Quản lý bài viết
			</h3>
			<div className="grid grid-cols-2 gap-3">
				<Link
					to={`/posts/${postId}/edit`}
					className={`flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-bold rounded-xl hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200 transition-all ${
						isDeleting ? "pointer-events-none opacity-50" : ""
					}`}>
					<Edit3 className="w-4 h-4" />
					Sửa
				</Link>

				<button
					onClick={onDelete}
					disabled={isDeleting}
					className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-red-600 text-sm font-bold rounded-xl hover:bg-red-50 hover:border-red-200 transition-all disabled:opacity-70 disabled:cursor-not-allowed">
					{isDeleting ? (
						<Loader2 className="w-4 h-4 animate-spin" />
					) : (
						<Trash2 className="w-4 h-4" />
					)}
					Xóa
				</button>
			</div>
		</div>
	);
}
