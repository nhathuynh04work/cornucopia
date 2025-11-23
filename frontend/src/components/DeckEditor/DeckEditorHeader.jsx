import { ArrowLeft, Loader2 } from "lucide-react";

function DeckEditorHeader({ isSaving, onSave, onBack }) {
	return (
		<header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200 h-16 flex items-center">
			<div className="w-5/6 mx-auto flex items-center justify-between">
				<div className="flex items-center gap-4">
					<button
						onClick={onBack}
						className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-colors">
						<ArrowLeft className="w-6 h-6" />
					</button>
					<h1 className="text-xl font-bold text-gray-900 hidden md:block">
						Chỉnh sửa bộ thẻ
					</h1>
				</div>

				<button
					onClick={onSave}
					disabled={isSaving}
					className="px-8 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-all disabled:opacity-70">
					{isSaving ? (
						<div className="flex items-center gap-2">
							<Loader2 className="w-4 h-4 animate-spin" />
							<span>Đang lưu...</span>
						</div>
					) : (
						"Hoàn tất"
					)}
				</button>
			</div>
		</header>
	);
}

export default DeckEditorHeader;
