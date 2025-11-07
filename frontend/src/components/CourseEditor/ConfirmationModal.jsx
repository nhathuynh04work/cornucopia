import { AlertTriangle, Loader2 } from "lucide-react";

function ConfirmationModal({ setShow, isDeleting, handleDelete, courseName }) {
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
			<div className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl">
				<div className="flex items-start gap-4">
					<div className="flex-shrink-0 flex items-center justify-center w-12 h-12 bg-red-100 rounded-full">
						<AlertTriangle className="w-6 h-6 text-red-600" />
					</div>
					<div>
						<h3 className="text-lg font-medium text-gray-900">
							Delete course?
						</h3>
						<p className="mt-2 text-sm text-gray-600">
							Are you sure you want to delete "{courseName}"? All
							of its data, including modules and lessons, will be
							permanently removed.
						</p>
					</div>
				</div>
				<div className="flex justify-end gap-3 mt-6">
					<button
						type="button"
						onClick={() => setShow(false)}
						disabled={isDeleting}
						className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
						Cancel
					</button>
					<button
						type="button"
						onClick={handleDelete}
						disabled={isDeleting}
						className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:bg-red-300">
						{isDeleting ? (
							<Loader2 className="w-4 h-4 animate-spin" />
						) : (
							"Delete"
						)}
					</button>
				</div>
			</div>
		</div>
	);
}

export default ConfirmationModal;
