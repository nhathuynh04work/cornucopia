import { Link } from "react-router";
import { Edit, Trash2, Loader2 } from "lucide-react";

export default function OwnerActions({ postId, onDelete, isDeleting }) {
	return (
		<div className="p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-3">
			<h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
				Manage
			</h3>
			<div className="flex gap-2">
				<Link
					to={`/posts/${postId}/edit`}
					className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white border border-gray-200 text-gray-700 text-xs font-medium rounded-lg hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200 transition-all shadow-sm ${
						isDeleting ? "pointer-events-none opacity-50" : ""
					}`}>
					<Edit className="w-3.5 h-3.5" />
					Edit
				</Link>

				<button
					onClick={onDelete}
					disabled={isDeleting}
					className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white border border-gray-200 text-red-600 text-xs font-medium rounded-lg hover:bg-red-50 hover:border-red-200 transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed">
					{isDeleting ? (
						<Loader2 className="w-3.5 h-3.5 animate-spin" />
					) : (
						<Trash2 className="w-3.5 h-3.5" />
					)}
					{isDeleting ? "Deleting..." : "Delete"}
				</button>
			</div>
		</div>
	);
}
