import { useParams } from "react-router";
import NavButton from "../components/NavButton";
import { useTestInfoQuery } from "@/hooks/useTestQuery";
import { Edit, Play } from "lucide-react";
import TestStatsBar from "../components/TestInfo/TestStatsBar";
import TestAttemptHistory from "../components/TestInfo/TestAttemptHistory";
import TestCommentsSection from "../components/TestInfo/TestCommentsSection";
import { useAuth } from "@/contexts/AuthContext";
import StatusBadge from "@/components/StatusBadge";

function TestInfo() {
	const { id } = useParams();
	const { role, user } = useAuth();
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
				<div className="flex flex-wrap items-center gap-4 px-6 mt-6">
					{user ? (
						<NavButton
							to={`/tests/${id}/attempt`}
							className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700">
							<Play className="w-4 h-4" />
							Take Test
						</NavButton>
					) : (
						<NavButton
							to="/login"
							className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-purple-700 bg-purple-100 border !border-purple-300 rounded-md hover:bg-purple-200">
							<Play className="w-4 h-4" />
							Log in to Take Test
						</NavButton>
					)}

					{role === "admin" && (
						<NavButton
							to={`/tests/${id}/edit`}
							className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-purple-700 bg-purple-100 border !border-purple-300 rounded-md hover:bg-purple-200">
							<Edit className="w-4 h-4" />
							Edit
						</NavButton>
					)}
				</div>

				{/* Attempt History */}
				<TestAttemptHistory testId={test.id} />

				{/* Comments Section */}
				<TestCommentsSection />
			</div>
		</div>
	);
}

export default TestInfo;
