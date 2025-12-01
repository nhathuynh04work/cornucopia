import { useState } from "react";
import { LEVEL_OPTIONS, LANGUAGE_OPTIONS } from "@/lib/constants/common";
import { Globe, BarChart } from "lucide-react";
import RadixSelect from "@/components/Shared/RadixSelect";

function SettingsModal({
	isOpen,
	onClose,
	initialLevel,
	initialLanguage,
	onConfirm,
}) {
	const [level, setLevel] = useState(initialLevel || "ALL_LEVELS");
	const [language, setLanguage] = useState(initialLanguage || "ENGLISH");

	if (!isOpen) return null;

	const handleSave = () => {
		onConfirm(level, language);
		onClose();
	};

	return (
		<div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 animate-in fade-in">
			<div className="bg-white rounded-2xl p-6 w-full max-w-sm m-4 shadow-xl">
				<h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
					<span className="p-1.5 bg-purple-100 rounded-lg text-purple-600">
						<Globe className="w-5 h-5" />
					</span>
					Cài đặt bộ thẻ
				</h3>

				<div className="space-y-5">
					{/* Language Selector */}
					<div className="space-y-2">
						<label className="block text-sm font-semibold text-gray-700">
							Ngôn ngữ
						</label>
						<RadixSelect
							value={language}
							onChange={setLanguage}
							options={LANGUAGE_OPTIONS}
							icon={<Globe className="w-4 h-4" />}
							className="w-full"
						/>
					</div>

					{/* Level Selector */}
					<div className="space-y-2">
						<label className="block text-sm font-semibold text-gray-700">
							Trình độ
						</label>
						<RadixSelect
							value={level}
							onChange={setLevel}
							options={LEVEL_OPTIONS}
							icon={<BarChart className="w-4 h-4" />}
							className="w-full"
						/>
					</div>

					<div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
						<button
							onClick={onClose}
							className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors">
							Hủy
						</button>
						<button
							onClick={handleSave}
							className="px-4 py-2 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition-colors shadow-sm">
							Lưu thay đổi
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default SettingsModal;
