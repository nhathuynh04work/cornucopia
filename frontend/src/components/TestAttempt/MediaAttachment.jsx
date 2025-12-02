import { Maximize2 } from "lucide-react";

export default function MediaAttachment({ mediaList }) {
	if (!mediaList || mediaList.length === 0) return null;

	const isVideo = (url) => {
		if (!url) return false;

		return /\.(mp4|webm|ogg|mov)$/i.test(url);
	};

	return (
		<div className="grid grid-cols-1 gap-4 my-4">
			{mediaList.map((url, index) => (
				<div
					key={index}
					className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50 group max-w-3xl mx-auto">
					{isVideo(url) ? (
						<video
							src={url}
							controls
							className="w-full max-h-[400px] bg-black"
						/>
					) : (
						<div className="relative">
							<img
								src={url}
								alt={`Attachment ${index + 1}`}
								className="w-full max-h-[400px] object-contain bg-white"
							/>
							<button
								type="button"
								className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70">
								<Maximize2 className="w-4 h-4" />
							</button>
						</div>
					)}
				</div>
			))}
		</div>
	);
}
