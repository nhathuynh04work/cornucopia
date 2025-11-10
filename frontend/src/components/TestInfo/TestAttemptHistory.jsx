import { useAttemptHistoryQuery } from "@/hooks/useTestQuery";
import AttemptHistoryItem from "./AttemptHistoryItem";
import { useAuth } from "@/contexts/AuthContext";

function TestAttemptHistory({ testId }) {
	const { user } = useAuth();
	const { data: attempts, isPending } = useAttemptHistoryQuery(testId);

	if (!user) return null;

	return (
		<div className="">
			<div className="p-6">
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
										index={attempts.length - index}
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
