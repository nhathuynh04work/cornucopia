import FlashcardsListsList from "../Flashcards/FlashcardsListsList";
import CourseList from "../Courses/CourseList";
import AttemptHistoryList from "../TestInfo/AttemptHistoryList";

export default function UserDashboard({ data }) {
	const { stats } = data;
	const { recentFlashcardLists, recentTestAttempts, enrolledCourses } = stats;

	return (
		<div className="w-5/6 mx-auto p-6 space-y-8">
			{/* Courses */}
			<section>
				<h2 className="text-xl font-medium mb-6">Your Courses</h2>
				<CourseList courses={enrolledCourses} />
			</section>

			{/* Flashcard Lists */}
			<section>
				<h2 className="text-xl font-medium mb-6">
					Your Flashcard Lists
				</h2>
				<FlashcardsListsList lists={recentFlashcardLists} />
			</section>

			{/* Recent Test Attempts */}
			<section>
				<h2 className="text-xl font-medium mb-6">
					Recent Test Attempts
				</h2>
				<AttemptHistoryList
					attempts={recentTestAttempts}
					className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
				/>
			</section>
		</div>
	);
}
