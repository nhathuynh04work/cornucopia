import { useMemo, useState } from "react";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getAttemptResult } from "@/apis/attemptApi";
import { flattenTestItems } from "@/store/testEditorStore";
import ResultsTable from "@/components/AttemptResult/ResultsTable";
import ResultSidebar from "@/components/AttemptResult/ResultSidebar";
import ViewDetailsModal from "@/components/AttemptResult/ViewDetailsModal";

function AttemptResult() {
	const { id } = useParams();
	const [selectedQuestionId, setSelectedQuestionId] = useState(null);

	const { data: attemptResult, isPending } = useQuery({
		queryKey: ["attempt-results", id],
		queryFn: () => getAttemptResult(id),
	});

	const flatQuestions = useMemo(() => {
		if (!attemptResult?.test.items) return [];
		return flattenTestItems(attemptResult.test.items).flatQuestions;
	}, [attemptResult?.test.items]);

	if (isPending) {
		return <p>Loading...</p>;
	}

	if (!attemptResult) {
		return <p>Error: Could not load attempt results.</p>;
	}

	return (
		<>
			<div className="flex h-[calc(100vh-64px)] overflow-hidden bg-white">
				{/* Left: Test title + table */}
				<div className="w-5/6 px-6 py-8 flex flex-col h-full">
					<h1 className="text-3xl font-bold mb-2">
						{attemptResult.test.title}
					</h1>
					<p className="text-gray-500 mb-6">Test Result</p>

					<ResultsTable
						questions={flatQuestions}
						onViewDetails={(id) => setSelectedQuestionId(id)}
					/>
				</div>

				{/* Right: stats */}
				<div className="flex-1 bg-gray-50 border-l border-gray-200 p-6 overflow-y-auto scroll-container">
					<ResultSidebar attemptResult={attemptResult} />
				</div>
			</div>

			{/* details modal */}
			<ViewDetailsModal
				testMedia={attemptResult.test.media}
				selectedQuestionId={selectedQuestionId}
				onClose={() => setSelectedQuestionId(null)}
				testItems={attemptResult.test.items}
				flatQuestions={flatQuestions}
			/>
		</>
	);
}

export default AttemptResult;
