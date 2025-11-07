import { useState } from "react";
import { useCoursesQuery } from "@/hooks/useCourseQuery";
import Modal from "../components/Modal";
import { useCreateCourseMutation } from "@/hooks/useCourseMutation";
import { Link } from "react-router";
import CreateCourseForm from "@/components/Courses/CreateCourseForm";

function Courses() {
	const [showModal, setShowModal] = useState(false);
	const { data: courses, isPending } = useCoursesQuery();
	const { mutate, isPending: isSubmitting } = useCreateCourseMutation();

	function handleCreateCourse(formData) {
		mutate(formData, {
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
						isSubmitting={isSubmitting}
					/>
				</Modal>
			)}
		</div>
	);
}

export default Courses;
