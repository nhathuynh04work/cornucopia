import AttemptHistoryItem from "@/components/TestInfo/AttemptHistoryItem";

export default function RecentTestAttempts({ attempts = [] }) {
	return (
		<section>
			<h2 className="text-xl font-semibold text-gray-700 mb-5">
				Recent Test Attempts
			</h2>
			<div className={`space-y-3 p-1 pr-2`}>
				{attempts.length > 0 ? (
					attempts.map((attempt) => (
						<AttemptHistoryItem
							key={attempt.id}
							attempt={attempt}
						/>
					))
				) : (
					<p className="text-gray-500 text-sm p-2">
						You haven't attempted any tests yet.
					</p>
				)}
			</div>
		</section>
	);
}
