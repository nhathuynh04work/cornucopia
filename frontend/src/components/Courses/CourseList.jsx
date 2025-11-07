import CourseCard from "./CourseCard";

export default function CourseList({
	courses,
	isPending,
	searchTerm,
	emptyMessage,
	searchEmptyMessage,
}) {
	if (isPending) {
		return (
			<p className="p-6 text-center text-gray-500">Loading courses...</p>
		);
	}

	if (courses?.length === 0) {
		const message = searchTerm ? searchEmptyMessage : emptyMessage;
		return <p className="text-center text-gray-500 mt-10">{message}</p>;
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
			{courses.map((course) => (
				<CourseCard key={course.id} course={course} />
			))}
		</div>
	);
}
