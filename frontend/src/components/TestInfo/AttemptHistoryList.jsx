import AttemptHistoryItem from "./AttemptHistoryItem";

function AttemptHistoryList({ attempts, className }) {
	return (
		<div className={`${className}`}>
			{attempts.length === 0 ? (
				<p className="text-sm text-gray-500 p-4 bg-white rounded-md border border-gray-200">
					You have no attempt yet.
				</p>
			) : (
				attempts.map((attempt) => (
					<AttemptHistoryItem key={attempt.id} attempt={attempt} />
				))
			)}
		</div>
	);
}

export default AttemptHistoryList;
