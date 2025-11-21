import DashboardSection from "../DashboardSection";


export default function UserStats({ stats }) {
	const { coursesInProgress, testsTaken, flashcardLists } = stats;

	return (
		<DashboardSection title="My Stats">
			<div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200 space-y-2">
				<p className="text-md text-gray-700 flex justify-between items-center">
					Courses in Progress:{" "}
					<span className="font-semibold text-purple-700 text-xl">
						{coursesInProgress}
					</span>
				</p>
				<p className="text-md text-gray-700 flex justify-between items-center">
					Tests Taken:{" "}
					<span className="font-semibold text-purple-700 text-xl">
						{testsTaken}
					</span>
				</p>
				<p className="text-md text-gray-700 flex justify-between items-center">
					Flashcard Lists:{" "}
					<span className="font-semibold text-purple-700 text-xl">
						{flashcardLists}
					</span>
				</p>
			</div>
		</DashboardSection>
	);
}
