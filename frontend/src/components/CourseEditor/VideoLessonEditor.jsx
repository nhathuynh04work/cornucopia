import { useState } from "react";
import { UploadCloud, Loader2, Play, RefreshCw } from "lucide-react";
import MediaUploader from "@/components/Shared/MediaUploader";

export default function VideoLessonEditor({ lesson, onChange }) {
	const [isUploading, setIsUploading] = useState(false);
	const [uploadProgress, setUploadProgress] = useState(0);
	const [isPlaying, setIsPlaying] = useState(false);

	const handleUploadStart = () => {
		setIsUploading(true);
		setUploadProgress(0);
		setIsPlaying(false);
	};

	const handleUploadSuccess = (data) => {
		const rawDuration = Math.ceil(data.duration || 0);
		const validDuration = Math.max(1, rawDuration / 60);
		onChange({ videoUrl: data.url, duration: validDuration });
		setIsUploading(false);
		setUploadProgress(0);
	};

	return (
		<MediaUploader
			accept="video/*"
			disabled={isUploading}
			onUploadStart={handleUploadStart}
			onUploadProgress={setUploadProgress}
			onUploadSuccess={handleUploadSuccess}
			onUploadError={() => setIsUploading(false)}>
			{isUploading ? (
				<div className="border-2 border-dashed border-purple-200 bg-purple-50 rounded-xl p-8 flex flex-col items-center justify-center text-purple-700 cursor-default">
					<Loader2 className="w-8 h-8 animate-spin mb-3" />
					<p className="font-bold text-sm mb-2">Đang tải lên...</p>
					<div className="w-full max-w-xs h-2 bg-purple-200 rounded-full overflow-hidden">
						<div
							className="h-full bg-purple-600 transition-all duration-300"
							style={{ width: `${uploadProgress}%` }}
						/>
					</div>
					<p className="text-xs mt-2 font-medium">
						{Math.round(uploadProgress)}%
					</p>
				</div>
			) : !lesson.videoUrl ? (
				<div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-gray-500 hover:bg-purple-50 hover:border-purple-300 hover:text-purple-600 cursor-pointer transition-all bg-white">
					<div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-3">
						<UploadCloud className="w-5 h-5" />
					</div>
					<p className="font-bold text-sm">Nhấn để tải lên Video</p>
					<p className="text-xs opacity-70 mt-1">
						MP4, WEBM (Max 2GB)
					</p>
				</div>
			) : (
				<div className="flex gap-4 items-start bg-white p-3 rounded-xl border border-gray-200">
					{isPlaying ? (
						<div className="relative rounded-lg overflow-hidden bg-black w-64 shrink-0 aspect-video shadow-md">
							<video
								src={lesson.videoUrl}
								controls
								autoPlay
								className="w-full h-full object-contain"
							/>
						</div>
					) : (
						<div
							onClick={(e) => {
								e.stopPropagation();
								setIsPlaying(true);
							}}
							className="relative rounded-lg overflow-hidden bg-black w-48 shrink-0 aspect-video group shadow-sm border border-gray-200 cursor-pointer">
							<div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40">
								<div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
									<Play className="w-5 h-5 text-white fill-white" />
								</div>
							</div>
						</div>
					)}
					<div className="flex-1 text-sm text-gray-500">
						<p className="font-medium text-gray-900 mb-1">
							Video đã được tải lên
						</p>
						<p className="text-xs mb-3">
							Thời lượng: {lesson.duration} phút
						</p>
						<button className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5">
							<RefreshCw className="w-3 h-3" /> Thay đổi video
						</button>
					</div>
				</div>
			)}
		</MediaUploader>
	);
}
