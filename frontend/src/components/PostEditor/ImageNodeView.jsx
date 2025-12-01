import { NodeViewWrapper } from "@tiptap/react";
import { Trash2 } from "lucide-react";

export default function ImageNodeView({ node, deleteNode }) {
	const { src, alt } = node.attrs;

	const handleDelete = () => {
		deleteNode();
	};

	return (
		<NodeViewWrapper className="relative group inline-block my-4 max-w-full">
			<div className="relative rounded-xl overflow-hidden border border-gray-100 shadow-sm transition-all group-hover:shadow-md">
				<img src={src} alt={alt} className="block max-w-full h-auto" />

				{/* Overlay Actions */}
				<div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
					<button
						type="button"
						onClick={handleDelete}
						className="p-2 bg-white/90 backdrop-blur text-red-500 hover:bg-red-50 hover:text-red-600 rounded-lg shadow-sm border border-gray-200 transition-all"
						title="Remove image">
						<Trash2 className="w-4 h-4" />
					</button>
				</div>
			</div>
		</NodeViewWrapper>
	);
}
