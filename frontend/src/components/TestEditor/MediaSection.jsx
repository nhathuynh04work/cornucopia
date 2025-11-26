import { useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { Image as ImageIcon, X, Loader2 } from "lucide-react";
import MediaUploader from "@/components/Shared/MediaUploader";

export default function MediaSection({ nestIndex }) {
	const { control, setValue } = useFormContext();
	const mediaList = useWatch({
		control,
		name: `items.${nestIndex}.media`,
		defaultValue: [],
	});

	const [isUploading, setIsUploading] = useState(false);

	const handleAddMedia = (data) => {
		const newMedia = [
			...mediaList,
			{ url: data.url, id: data.mediaId, fileType: data.fileType },
		];
		setValue(`items.${nestIndex}.media`, newMedia, { shouldDirty: true });
		setIsUploading(false);
	};

	const handleRemoveMedia = (index) => {
		const newList = [...mediaList];
		newList.splice(index, 1);
		setValue(`items.${nestIndex}.media`, newList, { shouldDirty: true });
	};

	return (
		<div className="space-y-3 pt-2">
			<div className="flex items-center justify-between">
				<p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
					Đa phương tiện
				</p>
				<MediaUploader
					onUploadStart={() => setIsUploading(true)}
					onUploadSuccess={handleAddMedia}
					onUploadError={() => setIsUploading(false)}>
					<button className="text-xs font-medium text-purple-600 hover:bg-purple-50 px-2 py-1 rounded transition-colors flex items-center gap-1">
						<ImageIcon className="w-3.5 h-3.5" /> Thêm ảnh/video
					</button>
				</MediaUploader>
			</div>

			{(mediaList.length > 0 || isUploading) && (
				<div className="grid grid-cols-2 gap-4">
					{mediaList.map((m, i) => (
						<div
							key={i}
							className="relative group rounded-lg overflow-hidden border border-gray-200 bg-gray-50 aspect-video">
							{m.fileType?.startsWith("video") ? (
								<video
									src={m.url}
									className="w-full h-full object-cover"
									controls
								/>
							) : (
								<img
									src={m.url}
									alt="Media"
									className="w-full h-full object-cover"
								/>
							)}
							<button
								type="button"
								onClick={() => handleRemoveMedia(i)}
								className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-md hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100">
								<X className="w-4 h-4" />
							</button>
						</div>
					))}

					{/* Loading Skeleton Item */}
					{isUploading && (
						<div className="relative rounded-lg overflow-hidden border border-gray-200 bg-gray-100 aspect-video flex items-center justify-center animate-pulse">
							<Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
						</div>
					)}
				</div>
			)}
		</div>
	);
}
