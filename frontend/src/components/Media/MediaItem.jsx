import { Loader2, X } from "lucide-react";
import { useDeleteMediaMutation } from "@/hooks/useMediaMutation";
import MediaRenderer from "./MediaRenderer";

export default function MediaItem({ media, className, isEditing }) {
	const { id } = media;

	const { mutate: deleteMedia, isPending: isDeleting } =
		useDeleteMediaMutation();

	function handleDelete(e) {
		e.preventDefault();
		e.stopPropagation();
		deleteMedia(id);
	}

	// Combine default styles with the passed-in className
	const defaultStyles = "relative w-full rounded-md overflow-hidden group";
	const combinedClassName = `${defaultStyles} ${className || ""}`;

	return (
		<div className={combinedClassName}>
			<MediaRenderer media={media} />

			{/* Delete button (show on hover) */}
			{isEditing && (
				<button
					type="button"
					onClick={handleDelete}
					disabled={isDeleting}
					className="absolute top-1 right-1 z-10 flex items-center justify-center h-6 w-6 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 hover:bg-red-500 transition-all focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-400 disabled:opacity-100 disabled:bg-black/70 disabled:cursor-not-allowed"
					aria-label="Delete media">
					{isDeleting ? (
						<Loader2 className="w-3 h-3 animate-spin" />
					) : (
						<X className="w-3 h-3" />
					)}
				</button>
			)}
		</div>
	);
}
