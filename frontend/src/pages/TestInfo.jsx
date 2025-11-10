import { useParams } from "react-router";
import { useTestInfoQuery } from "@/hooks/useTestQuery";
import TestStatsBar from "../components/TestInfo/TestStatsBar";
import TestAttemptHistory from "../components/TestInfo/TestAttemptHistory";
import TestCommentsSection from "../components/TestInfo/TestCommentsSection";
import StatusBadge from "@/components/StatusBadge";
import ActionButtons from "@/components/TestInfo/ActionButtons";

function TestInfo() {
	const { id } = useParams();
	const { data: test, isPending } = useTestInfoQuery(id);

	if (isPending) {
		return <p className="p-6">Loading...</p>;
	}

	if (!test) {
		return <p className="p-6">Error: Test not found.</p>;
	}

	const questionsCount = test._count?.items || 0;
	const attemptsCount = test._count?.attempts || 0;

	return (
		<div className="flex justify-center bg-white min-h-[calc(100vh-64px)]">
			<div className="w-5/6 overflow-y-auto scroll-container py-8 space-y-8">
				{/* Header Section */}
				<div className="px-6">
					<div className="flex items-center gap-4 mb-4 flex-wrap">
						<h1 className="text-3xl font-bold text-gray-900">
							{test.title}
						</h1>
						<StatusBadge status={test.status} />
					</div>
					<p className="text-lg text-gray-800">
						{test.description ||
							"No description provided for this test."}
					</p>
				</div>

				{/* Stats Bar */}
				<TestStatsBar
					timeLimit={test.timeLimit}
					questionsCount={questionsCount}
					attemptsCount={attemptsCount}
				/>

				{/* Action Buttons */}
				<ActionButtons test={test} />

				{/* Attempt History */}
				<TestAttemptHistory testId={test.id} />

				{/* Comments Section */}
				<TestCommentsSection />
			</div>
		</div>
	);
}

export default TestInfo;
