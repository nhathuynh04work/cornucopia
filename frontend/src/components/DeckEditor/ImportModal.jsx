import { useState } from "react";
import { X } from "lucide-react";
import { extractCards } from "@/lib/extractors";
import { RadioItem } from "@/components/Shared/FilterSidebar";

function ImportModal({ isOpen, onClose, onImport }) {
	const [text, setText] = useState("");
	const [separator, setSeparator] = useState("tab"); // 'tab' or 'dash'

	if (!isOpen) return null;

	// Handle Tab key press to insert a tab character
	const handleKeyDown = (e) => {
		if (e.key === "Tab") {
			e.preventDefault();
			const { selectionStart, selectionEnd } = e.target;

			const newText =
				text.substring(0, selectionStart) +
				"\t" +
				text.substring(selectionEnd);

			setText(newText);

			// Restore cursor position after state update
			setTimeout(() => {
				e.target.selectionStart = e.target.selectionEnd =
					selectionStart + 1;
			}, 0);
		}
	};

	const handleImport = () => {
		const newCards = extractCards(text, separator);

		if (newCards.length > 0) {
			onImport(newCards);
			setText("");
		}

		onClose();
	};

	return (
		<div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 animate-in fade-in">
			<div className="bg-white rounded-2xl w-full max-w-2xl m-4 shadow-xl flex flex-col max-h-[90vh]">
				{/* Header */}
				<div className="flex items-center justify-between p-6 border-b border-gray-100">
					<h3 className="text-xl font-bold text-gray-900">
						Nhập dữ liệu
					</h3>
					<button
						onClick={onClose}
						className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all">
						<X className="w-5 h-5" />
					</button>
				</div>

				{/* Body */}
				<div className="p-6 flex-1 overflow-y-auto">
					<p className="text-sm text-gray-500 mb-4">
						Sao chép và dán dữ liệu của bạn vào bên dưới. Mỗi dòng
						là một thẻ mới.
					</p>

					<div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-4 text-sm bg-gray-50 p-4 rounded-xl border border-gray-100">
						<span className="font-medium text-gray-700 mr-2">
							Ngăn cách bởi:
						</span>
						<div className="flex gap-6">
							<RadioItem
								label="Tab (Excel)"
								name="separator"
								checked={separator === "tab"}
								onChange={() => setSeparator("tab")}
							/>
							<RadioItem
								label="Gạch nối ( - )"
								name="separator"
								checked={separator === "dash"}
								onChange={() => setSeparator("dash")}
							/>
						</div>
					</div>

					<textarea
						value={text}
						onChange={(e) => setText(e.target.value)}
						onKeyDown={handleKeyDown}
						placeholder={`Thuật ngữ 1\tĐịnh nghĩa 1\nThuật ngữ 2\tĐịnh nghĩa 2`}
						className="w-full h-64 p-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 outline-none focus:bg-white focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-all font-mono text-sm leading-relaxed resize-none"
					/>
				</div>

				{/* Footer */}
				<div className="p-6 border-t border-gray-100 flex justify-end gap-3">
					<button
						onClick={onClose}
						className="px-6 py-2.5 font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
						Hủy
					</button>
					<button
						onClick={handleImport}
						className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-all shadow-sm">
						Nhập thẻ
					</button>
				</div>
			</div>
		</div>
	);
}

export default ImportModal;
