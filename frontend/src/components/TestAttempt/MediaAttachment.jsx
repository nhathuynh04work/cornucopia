import { Maximize2 } from "lucide-react";

export default function MediaAttachment({ mediaList }) {
	if (!mediaList || mediaList.length === 0) return null;

	return (
		<div className="grid grid-cols-1 gap-4 my-4">
			{mediaList.map((m) => (
				<div
					key={m.id}
					className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50 group">
					{m.fileType.startsWith("image") ? (
						<img
							src={m.url}
							alt="Question attachment"
							className="w-full max-h-[300px] object-contain bg-white"
						/>
					) : (
						<div className="p-8 text-center text-gray-500">
							Video placeholder for {m.url}
						</div>
					)}
					<button className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
						<Maximize2 className="w-4 h-4" />
					</button>
				</div>
			))}
		</div>
	);
}
