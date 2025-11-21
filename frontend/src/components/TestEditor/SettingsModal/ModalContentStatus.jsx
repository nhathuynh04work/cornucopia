import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import { Loader2, Globe, Trash2, Archive } from "lucide-react";
import { useTestEditorStore } from "@/store/testEditorStore";
import { useDeleteTest, useUpdateTest } from "@/hooks/useTestMutation";
import ConfirmationModal from "@/components/ConfirmationModal";

export default function ModalContentStatus() {
	const test = useTestEditorStore((s) => s.test);
	const attemptCount = test._count.attempts;
	const navigate = useNavigate();

	const { mutate: updateTest, isPending: isUpdating } = useUpdateTest();
	const { mutate: deleteTest, isPending: isDeleting } = useDeleteTest();

	const [showConfirmModal, setShowConfirmModal] = useState(false);
	const [showPublishConfirm, setShowPublishConfirm] = useState(false);

	function handleUpdateStatus(newStatus) {
		updateTest(
			{ status: newStatus },
			{
				onSuccess: () => {
					toast.success("Status updated");
					setShowPublishConfirm(false);
				},
			}
		);
	}

	function handleDelete() {
		deleteTest(
			{},
			{
				onSuccess: () => {
					toast.success("Test deleted");
					navigate("/tests/admin");
				},
			}
		);
	}

	return (
		<div className="flex-1 p-6 bg-[#f7f7f8] rounded-l-2xl overflow-y-auto text-gray-700 text-sm space-y-8">
			{/* --- Status Section --- */}
			<section className="p-4 border rounded-lg bg-white shadow-sm">
				<h3 className="text-base font-semibold text-gray-900">
					Test Status
				</h3>
				<p className="mt-1 text-sm text-gray-600">
					Control whether this test is publicly visible to users.
				</p>

				<div className="mt-4 flex flex-col sm:flex-row gap-3">
					{/* --- DRAFT -> PUBLIC (confirmation required) --- */}
					{test.status === "DRAFT" && (
						<button
							type="button"
							onClick={() => setShowPublishConfirm(true)}
							disabled={isUpdating}
							className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 disabled:bg-gray-300">
							<Globe className="w-4 h-4" />
							Publish Test
						</button>
					)}

					{/* --- PUBLIC -> ARCHIVED --- */}
					{test.status === "PUBLIC" && (
						<button
							type="button"
							onClick={() => handleUpdateStatus("ARCHIVED")}
							disabled={isUpdating}
							className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 disabled:bg-gray-300">
							<Archive className="w-4 h-4" />
							Archive Test
						</button>
					)}

					{/* --- ARCHIVED -> PUBLIC --- */}
					{test.status === "ARCHIVED" && (
						<button
							type="button"
							onClick={() => handleUpdateStatus("PUBLIC")}
							disabled={isUpdating}
							className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 disabled:bg-gray-300">
							<Globe className="w-4 h-4" />
							Publish Test
						</button>
					)}

					{isUpdating && (
						<Loader2 className="w-5 h-5 animate-spin text-gray-400" />
					)}
				</div>

				{test.status === "PUBLIC" && (
					<p className="mt-3 text-xs text-green-700">
						This test is currently live and visible to users.
					</p>
				)}
				{test.status === "ARCHIVED" && (
					<p className="mt-3 text-xs text-gray-500">
						This test is archived and not visible to users.
					</p>
				)}
			</section>

			{/* --- Danger Zone --- */}
			<section className="p-4 border !border-red-300 rounded-lg bg-red-50 shadow-sm">
				<h3 className="text-md font-semibold text-red-900">
					Danger Zone
				</h3>
				<p className="mt-1 text-sm text-red-700">
					Be careful — deleting this test is permanent and cannot be
					undone.
				</p>
				<button
					type="button"
					onClick={() => setShowConfirmModal(true)}
					disabled={isDeleting || attemptCount > 0}
					className={`mt-4 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-md ${
						attemptCount > 0
							? "bg-gray-400 cursor-not-allowed"
							: "bg-red-600 hover:bg-red-700"
					}`}>
					<Trash2 className="w-4 h-4" />
					Delete Test
				</button>
				{attemptCount > 0 && (
					<p className="mt-2 text-xs text-red-600">
						Cannot delete a test with existing attempts.
					</p>
				)}
			</section>

			{/* --- Confirmation Modal for Delete --- */}
			{showConfirmModal && (
				<ConfirmationModal
					title="Delete test?"
					variant="danger"
					confirmText="Delete"
					isLoading={isDeleting}
					onConfirm={handleDelete}
					onCancel={() => setShowConfirmModal(false)}>
					<p>
						Are you sure you want to delete "<b>{test.title}</b>"?
						All related questions and answers will be permanently
						removed.
					</p>
				</ConfirmationModal>
			)}

			{/* --- Confirmation Modal for Publish --- */}
			{showPublishConfirm && (
				<ConfirmationModal
					title="Publish test?"
					variant="primary"
					confirmText="Publish"
					isLoading={isUpdating}
					onConfirm={() => handleUpdateStatus("PUBLIC")}
					onCancel={() => setShowPublishConfirm(false)}>
					<p>
						Are you sure you want to make "<b>{test.title}</b>"
						live? Once published, the test can no longer be edited
						as a draft.
					</p>
				</ConfirmationModal>
			)}
		</div>
	);
}
