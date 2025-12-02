import { useState } from "react";
import { useGetCourses } from "@/hooks/useCourseQuery";
import CourseCard from "@/components/Courses/CourseCard";
import PaginationControl from "@/components/Shared/PaginationControl";
import EmptyState from "@/components/Shared/EmptyState";
import { BookOpen, Loader2 } from "lucide-react";

export default function ProfileCoursesTab({ userId, searchTerm, sortBy }) {
	const [page, setPage] = useState(1);
	const limit = 10;

	const { data, isLoading } = useGetCourses({
		userId,
		search: searchTerm,
		sort: sortBy,
		page,
		limit,
	});

	if (isLoading) {
		return (
			<div className="flex justify-center py-12">
				<Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
			</div>
		);
	}

	const items = data?.data || data || [];
	const pagination =data?.pagination || { totalPages: 1, currentPage: 1 };
	const totalPages = pagination.totalPages || Math.ceil(items.length / limit) || 1;

	if (items.length === 0) {
		return <EmptyState icon={BookOpen} message="Chưa có khóa học nào." />;
	}

	return (
		<div className="space-y-6">
			<div className="flex flex-col gap-4">
				{items.map((course) => (
					<div
						key={course.id}
						className="w-full relative group animate-in fade-in slide-in-from-bottom-2 duration-300">
						<CourseCard course={course} />
					</div>
				))}
			</div>

			{totalPages > 1 && (
				<PaginationControl
					currentPage={page}
					totalPages={totalPages}
					onPageChange={setPage}
				/>
			)}
		</div>
	);
}
