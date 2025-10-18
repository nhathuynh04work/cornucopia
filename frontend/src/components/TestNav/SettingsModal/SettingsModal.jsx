import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ModalHeader from "./ModalHeader";
import ModalSidebar from "./ModalSidebar";
import ModalContentGeneral from "./ModalContentGeneral";
import ModalFooter from "./ModalFooter";
import { useUpdateTestMutation } from "../../../hooks/useTestMutation";
import { useTestEditorStore } from "../../../store/testEditorStore";

function SettingsModal({ isOpen, onClose }) {
	const settings = useTestEditorStore((s) => s.test);
	const [initialData, setInitialData] = useState(settings);
	const [formData, setFormData] = useState(settings);
	const { isPending, mutateAsync: updateTest } = useUpdateTestMutation(
		settings?.id
	);

	useEffect(() => {
		if (settings) {
			setFormData(settings);
			setInitialData(settings);
		}
	}, [settings]);

	function handleChange(key, value) {
		setFormData((prev) => ({ ...prev, [key]: value }));
	}

	function getChangedFields() {
		const changes = {};
		for (const key in formData) {
			if (formData[key] !== initialData[key]) {
				changes[key] = formData[key];
			}
		}
		return changes;
	}

	async function handleSave() {
		const changes = getChangedFields();
		if (Object.keys(changes).length === 0) return;

		try {
			await updateTest(changes);
			toast.success("Test info updated!");
			onClose();
		} catch (err) {
			console.error(err);
		}
	}

	if (!isOpen) return null;

	return (
		<div
			className="fixed inset-0 bg-[rgba(20,10,40,0.6)] backdrop-blur-[1px] flex items-center justify-center z-50"
			onClick={isPending ? null : onClose}>
			<div
				className="relative bg-[#e9ebee] rounded-2xl shadow-2xl w-5xl h-[600px] flex flex-col overflow-hidden pt-4 pl-4 transition-opacity"
				onClick={(e) => e.stopPropagation()}>
				<ModalHeader />

				<div className="flex flex-1 gap-6 overflow-hidden">
					<ModalSidebar />
					<main className="flex-1 flex flex-col">
						<ModalContentGeneral
							data={formData}
							onChange={handleChange}
						/>
						<ModalFooter
							onClose={onClose}
							onSave={handleSave}
							isPending={isPending}
							isUnchanged={
								Object.keys(getChangedFields()).length === 0
							}
						/>
					</main>
				</div>
			</div>
		</div>
	);
}

export default SettingsModal;
