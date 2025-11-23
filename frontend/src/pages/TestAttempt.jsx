import TestRenderer from "@/components/TestAttempt/TestRenderer";
import TestSidebar from "@/components/TestAttempt/TestSidebar";
import { useGetTestForAttempt } from "@/hooks/useTestQuery";
import { useTestTimer } from "@/hooks/useTestTimer";
import { useParams } from "react-router";

function TestAttempt() {
	const { testId } = useParams();
	const { isPending, isError, data: test } = useGetTestForAttempt(testId);

	useTestTimer();

	if (isPending)
		return (
			<div className="flex h-screen items-center justify-center">
				<p>Loading Test...</p>
			</div>
		);

	if (isError || !test) return <p>Cannot attempt this test</p>;

	return (
		<div className="flex h-screen overflow-hidden bg-white">
			{/* Test Content */}
			<div className="scroll-container flex-[4] overflow-y-auto p-8">
				<TestRenderer />
			</div>

			{/* Sidebar */}
			<div className="scroll-container flex-[1] overflow-y-auto border-l border-gray-200">
				<TestSidebar />
			</div>
		</div>
	);
}

export default TestAttempt;
