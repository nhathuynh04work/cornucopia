import ConfirmationModal from "@/components/Shared/ConfirmationModal";
import ImportModal from "./ImportModal";
import SettingsModal from "./SettingsModal";

function DeckEditorModals({
	modals,
	toggleModal,
	level,
	language,
	isDeleting,
	onImport,
	onSettingsConfirm,
	onDeleteConfirm,
	onLeaveConfirm,
}) {
	return (
		<>
			<ImportModal
				isOpen={modals.import}
				onClose={() => toggleModal("import", false)}
				onImport={onImport}
				key={modals.import ? "import-open" : "import-closed"}
			/>

			<SettingsModal
				isOpen={modals.settings}
				onClose={() => toggleModal("settings", false)}
				initialLevel={level}
				initialLanguage={language}
				onConfirm={onSettingsConfirm}
				key={modals.settings ? "settings-open" : "settings-closed"}
			/>

			{modals.delete && (
				<ConfirmationModal
					title="Xóa bộ thẻ"
					confirmText="Xóa vĩnh viễn"
					variant="danger"
					isLoading={isDeleting}
					onConfirm={onDeleteConfirm}
					onCancel={() => toggleModal("delete", false)}>
					Bạn có chắc chắn muốn xóa bộ thẻ này không? Hành động này
					không thể hoàn tác.
				</ConfirmationModal>
			)}

			{modals.leave && (
				<ConfirmationModal
					title="Rời khỏi trang?"
					confirmText="Rời đi"
					variant="danger"
					onConfirm={onLeaveConfirm}
					onCancel={() => toggleModal("leave", false)}>
					Bạn có những thay đổi chưa được lưu. Nếu bạn rời đi ngay bây
					giờ, mọi thay đổi sẽ bị mất.
				</ConfirmationModal>
			)}
		</>
	);
}

export default DeckEditorModals;
