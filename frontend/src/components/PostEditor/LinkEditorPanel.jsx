import { useState } from "react";
import { Link as LinkIcon, Type, X } from "lucide-react";

export default function LinkEditorPanel({
	initialUrl = "",
	initialText = "",
	onSave,
	onCancel,
}) {
	const [url, setUrl] = useState(initialUrl);
	const [text, setText] = useState(initialText);

	const handleSubmit = (e) => {
		e.preventDefault();
		onSave(url, text);
	};

	return (
		<div className="w-80 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
			<div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
				<h3 className="font-semibold text-gray-800 text-sm">
					Insert Link
				</h3>
				<button
					onClick={onCancel}
					className="text-gray-400 hover:text-gray-600 transition-colors">
					<X className="w-4 h-4" />
				</button>
			</div>

			<form onSubmit={handleSubmit} className="p-4 space-y-3">
				<div className="space-y-1.5">
					<label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
						<Type className="w-3 h-3" />
						Text
					</label>
					<input
						type="text"
						value={text}
						onChange={(e) => setText(e.target.value)}
						placeholder="Display text..."
						className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-sm focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all outline-none"
					/>
				</div>

				<div className="space-y-1.5">
					<label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
						<LinkIcon className="w-3 h-3" />
						URL
					</label>
					<input
						type="url"
						value={url}
						onChange={(e) => setUrl(e.target.value)}
						placeholder="https://example.com"
						autoFocus
						className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-sm focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all outline-none"
					/>
				</div>

				<div className="pt-1 flex justify-end gap-2">
					<button
						type="button"
						onClick={onCancel}
						className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-md transition-colors">
						Cancel
					</button>
					<button
						type="submit"
						className="px-3 py-1.5 text-xs font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-md shadow-sm transition-all">
						Save Link
					</button>
				</div>
			</form>
		</div>
	);
}
