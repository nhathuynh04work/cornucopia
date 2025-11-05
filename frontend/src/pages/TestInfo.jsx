import { useParams } from "react-router";
import NavButton from "../components/NavButton";
import { useTestLiteQuery } from "@/hooks/useTestQuery";
import { Edit, Play } from "lucide-react";

import TestStatsBar from "../components/TestInfo/TestStatsBar";
import TestInfoSidebar from "../components/TestInfo/TestInfoSidebar";
import TestCommentsSection from "../components/TestInfo/TestCommentsSection";

function TestInfo() {
	const { id } = useParams();
	const { data: test, isPending } = useTestLiteQuery(id);

	const userRole = "admin";
	const testStatus = "published";

	const statusStyles = {
		published: "bg-green-100 text-green-800",
		draft: "bg-yellow-100 text-yellow-800",
	};

	if (isPending) {
		return <p className="p-6">Loading...</p>;
	}

	if (!test) {
		return <p className="p-6">Error: Test not found.</p>;
	}

	const questionsCount = test._count?.items || 0;
	const attemptsCount = test._count?.attempts || 0;

	return (
		<div className="flex h-[calc(100vh-65px)] overflow-hidden bg-white">
			{/* Column 1: Main Content (Test Details) */}
			<div className="w-3/4 overflow-y-auto scroll-container">
				{/* Header Section */}
				<div className="px-6 pt-8">
					<div className="flex items-center gap-4 mb-4">
						<h1 className="text-3xl font-bold text-gray-900">
							{test.title}
						</h1>
						<span
							className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
								statusStyles[testStatus] ||
								"bg-gray-100 text-gray-800"
							}`}>
							{testStatus.charAt(0).toUpperCase() +
								testStatus.slice(1)}
						</span>
					</div>
					<p className="text-lg text-gray-800 mb-8">
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

				{/* Action Buttons Section */}
				<div className="flex items-center gap-4 px-6 mt-10">
					{/* --- THIS IS THE CHANGE --- */}
					{/* Swapped purple for the dark, professional gray from your nav bar */}
					<NavButton
						to={`/tests/${id}/attempt`}
						className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
						<Play className="w-4 h-4" />
						Take Test
					</NavButton>

					{userRole === "admin" && (
						<NavButton
							to={`/tests/${id}/edit`}
							className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
							<Edit className="w-4 h-4" />
							Edit
						</NavButton>
					)}
				</div>

				{/* Comments Section */}
				<TestCommentsSection />
			</div>

			{/* Column 2: Sidebar (Metadata) */}
			<TestInfoSidebar test={test} />
		</div>
	);
}

export default TestInfo;
