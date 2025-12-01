import { useState, useEffect } from "react";
import { X, Camera, Save, Loader2 } from "lucide-react";
import Avatar from "@/components/Shared/Avatar";

export default function ProfileSettingsModal({
	isOpen,
	onClose,
	user,
	onSave,
	isSaving,
}) {
	const [formData, setFormData] = useState({
		name: "",
		bio: "",
		avatarUrl: "",
	});

	useEffect(() => {
		if (isOpen && user) {
			setFormData({
				name: user.name || "",
				bio: user.bio || "",
				avatarUrl: user.avatarUrl || "",
			});
		}

		// Scroll lock
		if (isOpen) {
			document.body.style.overflow = "hidden";
			document.documentElement.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "unset";
			document.documentElement.style.overflow = "unset";
		}
		return () => {
			document.body.style.overflow = "unset";
			document.documentElement.style.overflow = "unset";
		};
	}, [isOpen, user]);

	if (!isOpen) return null;

	const handleSubmit = (e) => {
		e.preventDefault();
		onSave(formData);
	};

	return (
		<div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
			{/* Backdrop */}
			<div
				className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
				onClick={onClose}
			/>

			{/* Modal */}
			<div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
				{/* Header */}
				<div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
					<h2 className="text-lg font-bold text-gray-900">
						Chỉnh sửa hồ sơ
					</h2>
					<button
						onClick={onClose}
						className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
						<X className="w-5 h-5" />
					</button>
				</div>

				{/* Body */}
				<div className="overflow-y-auto p-6">
					<form onSubmit={handleSubmit} className="space-y-6">
						{/* Avatar Preview */}
						<div className="flex flex-col items-center gap-4">
							<div className="relative group">
								<Avatar
									url={formData.avatarUrl}
									name={formData.name}
									size="xl"
									className="ring-4 ring-gray-50 w-24 h-24 text-2xl"
								/>
								<div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
									<Camera className="w-8 h-8 text-white" />
								</div>
							</div>
							<p className="text-xs text-gray-400 font-medium">
								Ảnh đại diện
							</p>
						</div>

						{/* Name */}
						<div>
							<label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
								Tên hiển thị{" "}
								<span className="text-red-500">*</span>
							</label>
							<input
								type="text"
								required
								value={formData.name}
								onChange={(e) =>
									setFormData({
										...formData,
										name: e.target.value,
									})
								}
								className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm font-medium focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition-all"
							/>
						</div>

						{/* Bio */}
						<div>
							<label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
								Giới thiệu
							</label>
							<textarea
								rows={4}
								value={formData.bio}
								onChange={(e) =>
									setFormData({
										...formData,
										bio: e.target.value,
									})
								}
								className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition-all resize-none"
								placeholder="Viết đôi lời về bản thân..."
							/>
						</div>

						{/* Footer */}
						<div className="pt-2 flex items-center justify-end gap-3">
							<button
								type="button"
								onClick={onClose}
								className="px-4 py-2 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors">
								Hủy bỏ
							</button>
							<button
								type="submit"
								disabled={isSaving}
								className="px-4 py-2 rounded-lg text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 transition-colors shadow-lg shadow-purple-200 flex items-center gap-2">
								{isSaving ? (
									<Loader2 className="w-4 h-4 animate-spin" />
								) : (
									<Save className="w-4 h-4" />
								)}
								Lưu thay đổi
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
