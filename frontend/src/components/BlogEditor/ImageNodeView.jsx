import { NodeViewWrapper } from "@tiptap/react";
import { Trash2, Loader2, AlertCircle } from "lucide-react";
import { useDeleteMedia } from "@/hooks/useMediaMutation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ImageNodeView({ node, deleteNode }) {
	const [isDeleting, setIsDeleting] = useState(false);
	const { mutate: deleteMedia } = useDeleteMedia();

	const { src, alt, id: mediaId } = node.attrs;

	const handleDelete = () => {
		// 1. If local-only (no ID), just remove from editor state immediately
		if (!mediaId) {
			deleteNode();
			return;
		}

		// 2. If tracked by backend, delete from server first
		setIsDeleting(true);
		deleteMedia(
			{ id: mediaId },
			{
				onSuccess: () => {
					toast.success("Image deleted");
					deleteNode();
				},
				onError: () => {
					toast.error("Failed to delete image from server");
					setIsDeleting(false);
				},
			}
		);
	};

	return (
		<NodeViewWrapper className="relative group inline-block my-4 max-w-full">
			<div
				className={`relative rounded-xl overflow-hidden border border-gray-100 shadow-sm transition-all ${
					isDeleting
						? "opacity-50 grayscale"
						: "group-hover:shadow-md"
				}`}>
				<img src={src} alt={alt} className="block max-w-full h-auto" />

				{/* Overlay Actions */}
				<div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
					<button
						type="button"
						onClick={handleDelete}
						disabled={isDeleting}
						className="p-2 bg-white/90 backdrop-blur text-red-500 hover:bg-red-50 hover:text-red-600 rounded-lg shadow-sm border border-gray-200 transition-all"
						title="Delete image permanently">
						{isDeleting ? (
							<Loader2 className="w-4 h-4 animate-spin" />
						) : (
							<Trash2 className="w-4 h-4" />
						)}
					</button>
				</div>

				{/* Visual indicator if it's not tracked by backend */}
				{!mediaId && !isDeleting && (
					<div className="absolute bottom-2 right-2 bg-yellow-100 text-yellow-700 text-[10px] px-2 py-1 rounded-full flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
						<AlertCircle className="w-3 h-3" />
						<span>Local only</span>
					</div>
				)}
			</div>
		</NodeViewWrapper>
	);
}
