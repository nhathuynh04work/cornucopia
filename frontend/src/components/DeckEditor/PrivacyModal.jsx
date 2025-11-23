import { useState } from "react";

function PrivacyModal({ isOpen, onClose, initialIsPublic, onConfirm }) {
	const [isPublic, setIsPublic] = useState(!!initialIsPublic);

	if (!isOpen) return null;

	const handleSave = () => {
		onConfirm(isPublic);
		onClose();
	};

	return (
		<div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 animate-in fade-in">
			<div className="bg-white rounded-2xl p-6 w-full max-w-sm m-4 shadow-xl">
				<h3 className="text-lg font-bold text-gray-900 mb-4">
					Quyền riêng tư
				</h3>
				<div className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Ai có thể xem bộ thẻ này?
						</label>
						<select
							value={isPublic ? "true" : "false"}
							onChange={(e) =>
								setIsPublic(e.target.value === "true")
							}
							className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-gray-900 bg-white">
							<option value="true">Mọi người (Công khai)</option>
							<option value="false">
								Chỉ mình tôi (Riêng tư)
							</option>
						</select>
					</div>

					<div className="flex gap-3 justify-end pt-2">
						<button
							onClick={onClose}
							className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors">
							Hủy
						</button>
						<button
							onClick={handleSave}
							className="px-4 py-2 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition-colors">
							Lưu
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default PrivacyModal;
