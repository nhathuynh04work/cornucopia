import { useState } from "react";
import Modal from "../components/Modal";
import CreateTestForm from "../components/CreateTestForm";

function Tests() {
	const [showModal, setShowModal] = useState(false);

	function handleCreateTest({ title, description }) {
		console.log("Title:", title);
		console.log("Desc:", description);
		setShowModal(false);
	}

	return (
		<div className="p-8">
			<button
				onClick={() => setShowModal(true)}
				className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700 transition">
				New Test
			</button>

			{showModal && (
				<Modal onClose={() => setShowModal(false)}>
					<h2 className="text-xl font-semibold text-gray-800 mb-4">
						Create New Test
					</h2>
					<CreateTestForm
						onSubmit={handleCreateTest}
						onCancel={() => setShowModal(false)}
					/>
				</Modal>
			)}
		</div>
	);
}

export default Tests;
