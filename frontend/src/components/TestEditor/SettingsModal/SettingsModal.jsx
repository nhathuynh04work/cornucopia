/* eslint-disable no-unused-vars */
import React, { useState, useMemo, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import ModalHeader from "./ModalHeader";
import ModalSidebar from "./ModalSidebar";
import ModalContentGeneral from "./ModalContentGeneral";
import ModalFooter from "./ModalFooter";
import { useTestEditorStore } from "@/store/testEditorStore";
import { SETTINGS_TABS } from "@/lib/test-settings.config";
import ModalContentMedia from "./ModalContentMedia";
import { useUpdateTest } from "@/hooks/useTestEditorMutation";

function SettingsModal({ children }) {
	const [isOpen, setIsOpen] = useState(false);

	const test = useTestEditorStore((s) => s.test);
	const settings = useMemo(() => {
		const { items, ...rest } = test || {};
		return rest;
	}, [test]);

	const { mutateAsync: updateTest } = useUpdateTest();
	const [currentTab, setCurrentTab] = useState(SETTINGS_TABS.GENERAL);

	const methods = useForm({ defaultValues: settings });

	const {
		handleSubmit,
		reset,
		formState: { isSubmitting },
	} = methods;

	const handleOpen = () => setIsOpen(true);
	const handleClose = () => setIsOpen(false);

	// Runs when the modal opens or when the 'settings' data actually changes
	// This tells react-hook-form: "Update your internal values to match this new object"
	useEffect(() => {
		if (isOpen) {
			reset(settings);
		}
	}, [isOpen, settings, reset]);

	async function handleSave(values) {
		await updateTest(values);
	}

	return (
		<>
			{React.cloneElement(children, { onClick: handleOpen })}

			{isOpen && (
				<div
					className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
					onClick={isSubmitting ? null : handleClose}>
					<FormProvider {...methods}>
						<form
							onSubmit={handleSubmit(handleSave)}
							className="relative bg-[#e9ebee] rounded-2xl shadow-2xl w-5xl h-[600px] flex flex-col overflow-hidden pt-4 pl-4 transition-opacity"
							onClick={(e) => e.stopPropagation()}>
							<ModalHeader />

							<div className="flex flex-1 gap-6 overflow-hidden">
								<ModalSidebar
									currentTab={currentTab}
									onTabChange={setCurrentTab}
								/>
								<main className="flex-1 flex flex-col">
									{currentTab === SETTINGS_TABS.GENERAL && (
										<ModalContentGeneral />
									)}
									{currentTab === SETTINGS_TABS.MEDIA && (
										<ModalContentMedia />
									)}
								</main>
							</div>

							<ModalFooter onClose={handleClose} />
						</form>
					</FormProvider>
				</div>
			)}
		</>
	);
}

export default SettingsModal;
