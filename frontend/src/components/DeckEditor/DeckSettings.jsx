import { Plus, Trash2, Settings } from "lucide-react";
import { useFormContext } from "react-hook-form";

function DeckSettings({
	onImportClick,
	onPrivacyClick,
	onDeleteClick,
	currentPrivacy,
}) {
	const {
		register,
		formState: { errors },
	} = useFormContext();

	return (
		<div className="mb-10 space-y-4 px-1">
			{/* Title Input */}
			<div className="space-y-2">
				<label className="block text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
					Tiêu đề
				</label>
				<input
					type="text"
					{...register("title")}
					placeholder="Nhập tiêu đề..."
					className="w-full text-lg p-4 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 font-medium transition-all outline-none ring-0 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
				/>
				{errors.title && (
					<p className="text-sm text-red-500 ml-1">
						{errors.title.message}
					</p>
				)}
			</div>

			{/* Toolbar */}
			<div className="flex items-center justify-between pt-2">
				<button
					onClick={onImportClick}
					className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-purple-50 text-gray-700 hover:text-purple-700 font-bold rounded-lg border border-gray-200 hover:border-purple-200 transition-all">
					<Plus className="w-4 h-4" />
					<span>Nhập</span>
				</button>

				<div className="flex items-center gap-2">
					<button
						onClick={onPrivacyClick}
						className="p-2 bg-white text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg border border-gray-200 hover:border-purple-200 transition-all"
						title={`Quyền riêng tư: ${
							currentPrivacy ? "Công khai" : "Riêng tư"
						}`}>
						<Settings className="w-5 h-5" />
					</button>

					<button
						onClick={onDeleteClick}
						className="p-2 bg-white text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg border border-gray-200 hover:border-red-200 transition-all">
						<Trash2 className="w-5 h-5" />
					</button>
				</div>
			</div>
		</div>
	);
}

export default DeckSettings;
