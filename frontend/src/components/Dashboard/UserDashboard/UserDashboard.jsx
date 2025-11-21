import ActivityChart from "./ActivityChart";
import ContinueLearning from "./ContinueLearning";
import Discovery from "./Discovery";
import MyFlashcardLists from "./MyFlashcardLists";
import RecentTestAttempts from "./RecentTestAttempts";
import UserStats from "./UserStats";

export default function UserDashboard({ data }) {
	const { enrolledCourses, recentTestAttempts, myFlashcardLists, discover } =
		data;

	const stats = {
		coursesInProgress: enrolledCourses?.length || 0,
		testsTaken: recentTestAttempts?.length || 0,
		flashcardLists: myFlashcardLists?.length || 0,
	};

	return (
		<div className="w-5/6 mx-auto p-6 space-y-8 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-8">
			{/* Main Content Area */}
			<div className="lg:col-span-2 space-y-8">
				<ContinueLearning courses={enrolledCourses} />
				<Discovery discoverData={discover} />
			</div>

			{/* Sidebar */}
			<div className="lg:col-span-1 space-y-8">
				<UserStats stats={stats} />
				<ActivityChart attempts={recentTestAttempts} />
				<MyFlashcardLists lists={myFlashcardLists} />
				<RecentTestAttempts attempts={recentTestAttempts} />
			</div>
		</div>
	);
}
