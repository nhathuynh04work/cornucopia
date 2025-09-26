import { useState } from "react";

function CreateTestForm({
	initialTitle = "Test Title",
	initialDescription = "Test Description",
	onSubmit,
	onCancel,
}) {
	const [title, setTitle] = useState(initialTitle);
	const [description, setDescription] = useState(initialDescription);

	function handleSubmit(e) {
		e.preventDefault();
		onSubmit({ title, description });
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div className="flex flex-col">
				<label
					htmlFor="title"
					className="text-sm font-medium text-gray-700 mb-1">
					Title
				</label>
				<input
					type="text"
					id="title"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
				/>
			</div>

			<div className="flex flex-col">
				<label
					htmlFor="description"
					className="text-sm font-medium text-gray-700 mb-1">
					Description
				</label>
				<input
					type="text"
					id="description"
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
				/>
			</div>

			<div className="flex justify-end space-x-3 pt-4">
				<button
					type="button"
					onClick={onCancel}
					className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition">
					Cancel
				</button>
				<button
					type="submit"
					className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700 transition">
					Create
				</button>
			</div>
		</form>
	);
}

export default CreateTestForm;
