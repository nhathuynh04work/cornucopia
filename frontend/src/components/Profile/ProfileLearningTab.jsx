import { BookOpen, History } from "lucide-react";
import EnrolledCourseCard from "@/components/Profile/EnrolledCourseCard";
import AttemptItem from "@/components/Profile/AttemptItem";
import PaginatedList from "./PaginatedList";

export default function ProfileLearningTab({ learning }) {
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
				<PaginatedList
					items={learning.courses || []}
					renderItem={(item) => <EnrolledCourseCard course={item} />}
					itemsPerPage={3}
					emptyMessage="Bạn chưa tham gia khóa học nào."
				/>
			</section>

			{/* Recent Attempts */}
			<section>
				<h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-4">
					<History className="w-5 h-5 text-blue-600" />
					Lịch sử làm bài thi
				</h3>
				<PaginatedList
					items={learning.attempts || []}
					renderItem={(item) => <AttemptItem attempt={item} />}
					itemsPerPage={5}
					emptyMessage="Bạn chưa thực hiện bài thi nào."
				/>
			</section>
		</div>
	);
}
