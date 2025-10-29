// src/components/TestInfo/TestAttemptHistory.jsx
import { useTestAttemptsHistoryQuery } from "@/hooks/useTestQuery";
import AttemptHistoryItem from "./AttemptHistoryItem";

function TestAttemptHistory({ testId }) {
	const { data: attempts, isPending } = useTestAttemptsHistoryQuery(testId);

	return (
		<div className="border-b border-gray-200">
			{" "}
			{/* Added border */}
			<div className="p-6">
				{" "}
				{/* Added padding here */}
				<h2 className="text-lg font-semibold text-gray-900 mb-4">
					Your Attempt History
				</h2>
				<div>
					{isPending && (
						<p className="text-sm text-gray-500">
							Loading history...
						</p>
					)}

					{attempts && (
						<div className="space-y-3">
							{attempts.length === 0 ? (
								<p className="text-sm text-gray-500 p-4 bg-white rounded-md border border-gray-200">
									You have not attempted this test yet.
								</p>
							) : (
								// Render the list items
								attempts.map((attempt, index) => (
									<AttemptHistoryItem
										key={attempt.id}
										attempt={attempt}
										index={attempts.length - index} // Pass index for Attempt #
									/>
								))
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

export default TestAttemptHistory;
