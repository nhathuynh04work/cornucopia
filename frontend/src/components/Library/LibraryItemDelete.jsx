import { Loader2, Trash2 } from "lucide-react";

export default function LibraryItemDelete({ onDelete, itemName, isDeleting }) {
	return (
		<button
			onClick={(e) => {
				e.preventDefault();
				e.stopPropagation();
				onDelete();
			}}
			disabled={isDeleting}
			className="absolute top-3 right-3 p-2 rounded-xl bg-white/90 text-gray-400 hover:text-red-500 hover:bg-red-50 shadow-sm opacity-0 group-hover:opacity-100 transition-all z-20 disabled:opacity-50"
			title={`Xóa ${itemName}`}>
			{isDeleting ? (
				<Loader2 className="w-4 h-4 animate-spin" />
			) : (
				<Trash2 className="w-4 h-4" />
			)}
		</button>
	);
}
