import { useState } from "react";

export default function CreateCourseForm({ onSubmit, onCancel, isSubmitting }) {
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [price, setPrice] = useState(0);

	const handleSubmit = (e) => {
		e.preventDefault();
		onSubmit({ name, description, price: parseInt(price, 10) });
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div>
				<label className="block text-sm font-medium text-gray-700">
					Course Name
				</label>
				<input
					type="text"
					required
					value={name}
					onChange={(e) => setName(e.target.value)}
					className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
				/>
			</div>
			<div>
				<label className="block text-sm font-medium text-gray-700">
					Description
				</label>
				<textarea
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
				/>
			</div>
			<div>
				<label className="block text-sm font-medium text-gray-700">
					Price (in cents)
				</label>
				<input
					type="number"
					value={price}
					onChange={(e) => setPrice(e.target.value)}
					className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
				/>
			</div>
			<div className="flex justify-end gap-2 pt-4">
				<button
					type="button"
					onClick={onCancel}
					className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md">
					Cancel
				</button>
				<button
					type="submit"
					disabled={isSubmitting}
					className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md disabled:bg-gray-400">
					{isSubmitting ? "Creating..." : "Create Course"}
				</button>
			</div>
		</form>
	);
}
