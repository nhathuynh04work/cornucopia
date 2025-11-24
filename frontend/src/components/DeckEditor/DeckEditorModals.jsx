import ConfirmationModal from "@/components/Shared/ConfirmationModal";
import ImportModal from "./ImportModal";
import PrivacyModal from "./PrivacyModal";

function DeckEditorModals({
	modals,
	toggleModal,
	isPublic,
	isDeleting,
	onImport,
	onPrivacyConfirm,
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

			<PrivacyModal
				isOpen={modals.privacy}
				onClose={() => toggleModal("privacy", false)}
				initialIsPublic={isPublic}
				onConfirm={onPrivacyConfirm}
				key={modals.privacy ? "privacy-open" : "privacy-closed"}
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
