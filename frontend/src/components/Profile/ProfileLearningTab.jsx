import { useState } from "react";
import { BookOpen, History, Loader2 } from "lucide-react";
import { useGetCourses } from "@/hooks/useCourseQuery";
import { useGetAttemptedTests } from "@/hooks/useTestQuery";
import EnrolledCourseCard from "@/components/Profile/EnrolledCourseCard";
import PaginationControl from "@/components/Shared/PaginationControl";
import EmptyState from "@/components/Shared/EmptyState";
import AttemptItem from "../TestInfo/AttemptItem";

function EnrolledCoursesList({ userId, searchTerm }) {
	const [page, setPage] = useState(1);
	const limit = 3;

	const { data, isLoading } = useGetCourses({
		enrolledUserId: userId,
		search: searchTerm,
		page,
		limit,
	});

	if (isLoading)
		return <Loader2 className="w-6 h-6 animate-spin text-purple-600" />;

	const items = data?.data || data || [];
	const pagination = data?.pagination || { totalPages: 1 };
	const totalPages = pagination.totalPages || 1;

	if (items.length === 0)
		return (
			<EmptyState
				icon={BookOpen}
				message="Bạn chưa tham gia khóa học nào."
			/>
		);

	return (
		<div className="space-y-4">
			<div className="flex flex-col gap-4">
				{items.map((item) => (
					<div
						key={item.id}
						className="w-full relative group animate-in fade-in slide-in-from-bottom-2 duration-300">
						<EnrolledCourseCard course={item} />
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

function AttemptHistoryList({ userId, searchTerm }) {
	const [page, setPage] = useState(1);
	const limit = 5;

	const { data, isLoading } = useGetAttemptedTests({
		userId,
		search: searchTerm,
		page,
		limit,
	});

	if (isLoading)
		return <Loader2 className="w-6 h-6 animate-spin text-blue-600" />;

	const items = data?.tests || data || [];
	const pagination = data?.pagination || { totalPages: 1 };
	const totalPages = pagination.totalPages || 1;

	if (items.length === 0)
		return (
			<EmptyState
				icon={History}
				message="Bạn chưa thực hiện bài thi nào."
			/>
		);

	return (
		<div className="space-y-4">
			<div className="flex flex-col gap-4">
				{items.map((item) => (
					<div
						key={item.id}
						className="w-full relative group animate-in fade-in slide-in-from-bottom-2 duration-300">
						<AttemptItem attempt={item} />
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

export default function ProfileLearningTab({ userId, searchTerm }) {
	return (
		<div className="space-y-12">
			{/* Learning Courses */}
			<section>
				<div className="flex items-center justify-between mb-4">
					<h3 className="flex items-center gap-2 text-lg font-bold text-gray-900">
						<BookOpen className="w-5 h-5 text-purple-600" />
						Khóa học đang tham gia
					</h3>
				</div>
				<EnrolledCoursesList userId={userId} searchTerm={searchTerm} />
			</section>

			{/* Recent Attempts */}
			<section>
				<h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-4">
					<History className="w-5 h-5 text-blue-600" />
					Lịch sử làm bài thi
				</h3>
				<AttemptHistoryList userId={userId} searchTerm={searchTerm} />
			</section>
		</div>
	);
}
