export default function UserStats({ stats }) {
	const { coursesInProgress, testsTaken, flashcardLists } = stats;

	return (
		<section>
			<h2 className="text-xl font-semibold text-gray-700 mb-5">
				My Stats
			</h2>
			<div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
				<p className="text-md text-gray-700 mb-2 flex justify-between items-center">
					Courses in Progress:{" "}
					<span className="font-semibold text-purple-700 text-xl">
						{coursesInProgress}
					</span>
				</p>
				<p className="text-md text-gray-700 mb-2 flex justify-between items-center">
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
		</section>
	);
}
