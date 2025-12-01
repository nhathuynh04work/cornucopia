import {
	FileText,
	ImageIcon,
	Settings,
	UploadCloud,
	Loader2,
	RefreshCw,
} from "lucide-react";
import SimpleRichTextEditor from "@/components/Shared/SimpleRichTextEditor";
import RadixSelect from "@/components/Shared/RadixSelect";
import MediaUploader from "@/components/Shared/MediaUploader";
import { useState } from "react";
import { PRICE_TIERS, EXCERPT_LIMIT } from "@/lib/constants/course";
import { LANGUAGE_OPTIONS, LEVEL_OPTIONS } from "@/lib/constants/common";

export const BasicInfoSection = ({ course, onChange }) => {
	const currentExcerpt = course.excerpt || "";
	const currentLength = currentExcerpt.length;

	return (
		<div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 space-y-6 shadow-none">
			<div className="flex items-center justify-between border-b border-gray-100 pb-4">
				<h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
					<FileText className="w-5 h-5 text-purple-600" /> Thông tin
					cơ bản
				</h2>
			</div>
			<div className="space-y-6">
				<div>
					<label className="block text-sm font-bold text-gray-700 mb-1.5">
						Tên khóa học
					</label>
					<input
						value={course.title || ""}
						onChange={(e) => onChange("title", e.target.value)}
						className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-purple-50 focus:border-purple-500 outline-none font-bold text-lg text-gray-900 transition-all placeholder:font-normal"
						placeholder="Nhập tên khóa học..."
					/>
				</div>

				<div>
					<label className="block text-sm font-bold text-gray-700 mb-1.5">
						Mô tả ngắn (Subtitle)
					</label>
					<textarea
						value={course.excerpt || ""}
						maxLength={EXCERPT_LIMIT}
						onChange={(e) => onChange("excerpt", e.target.value)}
						className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-purple-50 focus:border-purple-500 outline-none text-gray-700 transition-all placeholder:font-normal h-24 resize-none leading-relaxed scroll-container"
						placeholder="Giới thiệu ngắn gọn về khóa học..."
					/>
					<div className="flex items-center justify-between mt-1.5">
						<span className="text-[11px] text-gray-400">
							Hiển thị trên thẻ khóa học và SEO
						</span>
						<div className="flex items-center gap-2">
							<span
								className={`text-[11px] font-semibold text-gray-400`}>
								{currentLength}/{EXCERPT_LIMIT}
							</span>
						</div>
					</div>
				</div>

				<div>
					<label className="block text-sm font-bold text-gray-700 mb-2">
						Mô tả chi tiết
					</label>
					<SimpleRichTextEditor
						value={course.description || ""}
						onChange={(val) => onChange("description", val)}
						placeholder="Nội dung chi tiết, mục tiêu khóa học, đối tượng tham gia..."
						className="min-h-[300px] bg-white rounded-xl border border-gray-200 focus:ring-4 focus:ring-purple-50 focus:border-purple-500 transition-all"
					/>
				</div>
			</div>
		</div>
	);
};

export const MediaSection = ({ course, onChange }) => {
	const [isUploading, setIsUploading] = useState(false);
	return (
		<div className="bg-white p-5 rounded-2xl border border-gray-200 space-y-4 shadow-none">
			<h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
				<ImageIcon className="w-4 h-4 text-purple-600" /> Ảnh bìa
			</h3>
			<MediaUploader
				accept="image/*"
				onUploadStart={() => setIsUploading(true)}
				onUploadSuccess={(data) => {
					onChange("coverUrl", data.url);
					setIsUploading(false);
				}}
				onUploadError={() => setIsUploading(false)}>
				<div className="relative group rounded-xl overflow-hidden bg-gray-50 border-2 border-dashed border-gray-200 aspect-[3/1] lg:aspect-video flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-purple-50 hover:border-purple-200 hover:text-purple-600 transition-all">
					{isUploading ? (
						<div className="flex flex-col items-center gap-2 text-purple-600 animate-pulse">
							<Loader2 className="w-6 h-6 animate-spin" />
							<span className="text-xs font-bold">
								Đang tải lên...
							</span>
						</div>
					) : course.coverUrl ? (
						<>
							<img
								src={course.coverUrl}
								alt="Cover"
								className="w-full h-full object-cover"
							/>
							<div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
								<p className="text-white font-bold text-xs flex items-center gap-1">
									<RefreshCw className="w-4 h-4" /> Thay đổi
								</p>
							</div>
						</>
					) : (
						<div className="flex flex-col items-center gap-2">
							<div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
								<UploadCloud className="w-4 h-4" />
							</div>
							<span className="text-xs font-bold">
								Tải ảnh lên
							</span>
						</div>
					)}
				</div>
			</MediaUploader>
			<p className="text-[10px] mt-2 text-gray-400 text-center">
				Khuyên dùng: 1280x720px (JPG, PNG)
			</p>
		</div>
	);
};

export const SettingsSection = ({ course, onChange }) => (
	<div className="bg-white p-6 rounded-2xl border border-gray-200 space-y-5 shadow-none">
		<h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2">
			<Settings className="w-4 h-4 text-purple-600" /> Cấu hình
		</h3>

		<div>
			<label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">
				Giá bán
			</label>
			<RadixSelect
				value={course.price}
				onChange={(val) => onChange("price", val)}
				options={PRICE_TIERS}
				className="w-full"
			/>
		</div>

		<div>
			<label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">
				Ngôn ngữ
			</label>
			<RadixSelect
				value={course.language}
				onChange={(val) => onChange("language", val)}
				options={LANGUAGE_OPTIONS}
				className="w-full"
			/>
		</div>

		<div>
			<label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">
				Trình độ
			</label>
			<RadixSelect
				value={course.level}
				onChange={(val) => onChange("level", val)}
				options={LEVEL_OPTIONS}
				className="w-full"
			/>
		</div>
	</div>
);
