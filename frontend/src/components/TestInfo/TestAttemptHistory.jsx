import { useAttemptHistoryQuery } from "@/hooks/useTestQuery";
import { useAuth } from "@/contexts/AuthContext";
import AttemptHistoryList from "./AttemptHistoryList";
import { Loader2 } from "lucide-react";

function TestAttemptHistory({ testId }) {
	const { user } = useAuth();
	const { data: attempts, isPending } = useAttemptHistoryQuery(testId);

	if (!user) return null;
	if (isPending) return <Loader2 />;

	return (
		<div className="">
			<div className="p-6">
				<h2 className="text-lg font-semibold text-gray-900 mb-4">
					Your Attempt History
				</h2>

				<AttemptHistoryList attempts={attempts} className="space-y-3" />
			</div>
		</div>
	);
}

export default TestAttemptHistory;
