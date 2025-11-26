import { useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { FileText, Music, Trash2, Loader2 } from "lucide-react";
import MediaUploader from "@/components/Shared/MediaUploader";

export default function TestInfoEditor() {
	const { register, setValue, control } = useFormContext();
	const audioUrl = useWatch({ control, name: "audioUrl" });

	// Local loading state for audio upload
	const [isUploadingAudio, setIsUploadingAudio] = useState(false);

	return (
		<div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
			<div className="flex items-center gap-3 mb-2">
				<div className="p-2 bg-purple-100 rounded-lg text-purple-600">
					<FileText className="w-6 h-6" />
				</div>
				<h2 className="text-2xl font-bold text-gray-900">
					Thông tin bài thi
				</h2>
			</div>

			<div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
				<div>
					<label className="block text-sm font-bold text-gray-700 mb-2">
						Tiêu đề bài thi
					</label>
					<input
						{...register("title", { required: true })}
						className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-purple-100 focus:border-purple-500 outline-none transition-all font-medium"
						placeholder="Nhập tiêu đề..."
					/>
				</div>
				<div>
					<label className="block text-sm font-bold text-gray-700 mb-2">
						Mô tả
					</label>
					<textarea
						{...register("description")}
						rows={4}
						className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-purple-100 focus:border-purple-500 outline-none transition-all resize-none"
						placeholder="Mô tả nội dung bài thi..."
					/>
				</div>

				{/* Time Limit Input */}
				<div className="flex items-center gap-4">
					<div className="flex-1">
						<label className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
							Thời gian làm bài (phút)
						</label>
						<input
							type="number"
							{...register("timeLimit", {
								valueAsNumber: true,
								min: 0,
							})}
							className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-purple-100 focus:border-purple-500 outline-none transition-all font-medium"
							placeholder="VD: 45"
						/>
					</div>
					<div className="flex-1"></div>
				</div>
			</div>

			<div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
				<div className="flex items-center justify-between mb-4">
					<div>
						<h3 className="text-sm font-bold text-gray-900">
							File nghe (Audio)
						</h3>
						<p className="text-xs text-gray-500">
							Dùng cho bài thi nghe, sẽ phát xuyên suốt bài thi.
						</p>
					</div>

					{/* Upload Button (Hidden if uploading or audio exists) */}
					{!audioUrl && !isUploadingAudio && (
						<MediaUploader
							accept="audio/*"
							onUploadStart={() => setIsUploadingAudio(true)}
							onUploadSuccess={(data) => {
								setValue("audioUrl", data.url);
								setIsUploadingAudio(false);
							}}
							onUploadError={() => setIsUploadingAudio(false)}>
							<button className="text-sm font-bold text-purple-600 bg-purple-50 hover:bg-purple-100 px-4 py-2 rounded-lg transition-colors">
								Tải lên
							</button>
						</MediaUploader>
					)}
				</div>

				{/* Loading Skeleton / Spinner */}
				{isUploadingAudio && (
					<div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-200 animate-pulse">
						<div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
							<Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
						</div>
						<div className="flex-1 h-2 bg-gray-200 rounded w-full max-w-[200px]"></div>
					</div>
				)}

				{/* Audio Player */}
				{!isUploadingAudio && audioUrl && (
					<div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-200">
						<div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
							<Music className="w-5 h-5" />
						</div>
						<div className="flex-1">
							<audio
								src={audioUrl}
								controls
								className="w-full h-8"
							/>
						</div>
						<button
							onClick={() => setValue("audioUrl", null)}
							className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
							<Trash2 className="w-4 h-4" />
						</button>
					</div>
				)}
			</div>
		</div>
	);
}
