import { useState } from "react";
import { useCoursesQuery } from "@/hooks/useCourseQuery";
import Modal from "../components/Modal";
import { useCreateCourseMutation } from "@/hooks/useCourseMutation";
import { Link } from "react-router";

function CreateCourseForm({ onSubmit, onCancel, isSubmitting }) {
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

function Courses() {
	const [showModal, setShowModal] = useState(false);
	const { data: courses, isPending } = useCoursesQuery();
	const createCourse = useCreateCourseMutation();

	async function handleCreateCourse(formData) {
		await createCourse.mutateAsync(formData, {
			onSuccess: () => {
				setShowModal(false);
			},
		});
	}

	if (isPending) {
		return <p className="p-6">Loading...</p>;
	}

	return (
		<div className="p-6 bg-white">
			{/* Header */}
			<div className="flex justify-between items-center pb-4 border-b border-gray-200">
				<h1 className="text-2xl font-bold text-gray-900">Courses</h1>
				<button
					onClick={() => setShowModal(true)}
					className="px-4 py-2 text-sm font-medium text-white bg-purple-700 rounded-md hover:bg-purple-800">
					New Course
				</button>
			</div>

			{/* Grid */}
			<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
				{courses?.length === 0 && (
					<p>No courses found. Create one to get started!</p>
				)}

				{courses?.map((course) => (
					<Link
						to={`/courses/${course.id}`}
						key={course.id}
						className="block border border-gray-200 rounded-lg shadow-sm overflow-hidden transition-all hover:shadow-md hover:border-purple-300">
						<img
							src={course.coverUrl || "/default-course-cover.svg"}
							alt={course.name}
							className="w-full h-40 object-cover"
						/>
						<div className="p-4">
							<h2 className="text-lg font-semibold text-gray-900 truncate">
								{course.name}
							</h2>
							<p className="text-sm text-gray-600 mt-1 truncate">
								{course.description}
							</p>
							<p className="text-lg font-bold text-gray-800 mt-2">
								${course.price / 100}
							</p>
						</div>
					</Link>
				))}
			</div>

			{/* Modal */}
			{showModal && (
				<Modal onClose={() => setShowModal(false)}>
					<h2 className="text-xl font-semibold text-gray-800 mb-4">
						Create New Course
					</h2>
					<CreateCourseForm
						onSubmit={handleCreateCourse}
						onCancel={() => setShowModal(false)}
						isSubmitting={createCourse.isPending}
					/>
				</Modal>
			)}
		</div>
	);
}

export default Courses;
