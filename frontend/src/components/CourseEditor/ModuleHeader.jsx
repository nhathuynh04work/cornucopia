import { useState } from "react";
import { Trash2, Loader2, ChevronRight, ChevronDown } from "lucide-react";
import EditableText from "./EditableText";
import { toast } from "react-hot-toast";
import { useCourseEditorStore } from "@/store/courseEditorStore";
import { useDeleteModule, useUpdateModule } from "@/hooks/useModuleMutation";
import ConfirmationModal from "../ConfirmationModal";

export default function ModuleHeader({ module, isOpen, onToggle }) {
	const [showConfirmModal, setShowConfirmModal] = useState(false);

	const course = useCourseEditorStore((s) => s.course);
	const hasEnrollments = (course?._count?.enrollments || 0) > 0;

	const { mutate: deleteModule, isPending: isDeleting } = useDeleteModule(
		module.id
	);
	const { mutate: updateModule, isPending: isUpdating } = useUpdateModule(
		module.id
	);

	const isBusy = isUpdating || isDeleting;

	function handleTitleSave(value) {
		updateModule(
			{ title: value },
			{ onSuccess: () => toast.success("Title updated") }
		);
	}

	function handleStatusChange() {
		if (module.status === "DRAFT") {
			setShowConfirmModal(true);
			return;
		}

		updateModule({ status: "DRAFT" });
	}

	function handleConfirmPublish() {
		updateModule(
			{ status: "PUBLIC" },
			{ onSuccess: () => setShowConfirmModal(false) }
		);
	}

	const isPublic = module.status === "PUBLIC";
	const isSwitchDisabled = isBusy || (isPublic && hasEnrollments);
	const switchTooltip =
		isPublic && hasEnrollments
			? "Cannot move a public module to draft when students are enrolled."
			: isPublic
			? "Move to Draft"
			: "Publish Module";

	return (
		<>
			<div className="flex items-center justify-between p-4 border-b border-gray-200 group">
				{/* --- Left Side: Toggle, Title, Delete --- */}
				<div className="flex items-center gap-2">
					<button
						onClick={onToggle}
						disabled={isBusy}
						className="text-gray-400 hover:text-gray-800 disabled:opacity-50"
						aria-expanded={isOpen}
						aria-label={
							isOpen ? "Collapse module" : "Expand module"
						}>
						{isOpen ? (
							<ChevronDown className="w-4 h-4" />
						) : (
							<ChevronRight className="w-4 h-4" />
						)}
					</button>

					<EditableText
						initialValue={module.title}
						onSave={handleTitleSave}
						isPending={isUpdating}
						spanClassName="font-semibold text-gray-800 text-sm"
						inputClassName="font-semibold text-gray-800 text-sm w-[300px] p-0"
						hoverBehavior="parent"
					/>

					<button
						onClick={() => deleteModule()}
						disabled={isBusy}
						className="text-gray-400 hover:text-gray-800 flex-shrink-0 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity duration-150 disabled:opacity-50"
						aria-label="Delete module">
						{isDeleting ? (
							<Loader2 className="w-3 h-3 animate-spin" />
						) : (
							<Trash2 className="w-3 h-3" />
						)}
					</button>
				</div>

				{/* --- Right Side: Status Switch (New) --- */}
				<div className="flex items-center gap-2">
					<span
						className={`text-xs font-medium ${
							isPublic ? "text-green-600" : "text-gray-500"
						}`}>
						{isPublic ? "Public" : "Draft"}
					</span>
					<button
						onClick={handleStatusChange}
						disabled={isSwitchDisabled}
						title={switchTooltip}
						role="switch"
						aria-checked={isPublic}
						className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
							isPublic ? "bg-green-500" : "bg-gray-300"
						}`}>
						<span
							aria-hidden="true"
							className={`inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
								isPublic ? "translate-x-4" : "translate-x-0"
							}`}
						/>
					</button>
					{isUpdating && (
						<Loader2 className="w-4 h-4 animate-spin text-gray-400" />
					)}
				</div>
			</div>

			{showConfirmModal && (
				<ConfirmationModal
					title="Publish Module?"
					variant="primary"
					confirmText="Publish"
					onConfirm={handleConfirmPublish}
					onCancel={() => setShowConfirmModal(false)}
					isLoading={isUpdating}>
					<p>
						Are you sure you want to publish this module? If this
						course has enrolled students, you will not be able to
						move it back to a draft.
					</p>
				</ConfirmationModal>
			)}
		</>
	);
}
