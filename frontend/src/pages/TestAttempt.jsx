import TestRenderer from "@/components/TestAttempt/TestRenderer";
import TestSidebar from "@/components/TestAttempt/TestSidebar";
import { useTestAttemptQuery } from "@/hooks/useTestQuery";
import { useTestAttemptStore } from "@/store/testAttemptStore";
import { useEffect } from "react";
import { useParams } from "react-router";

function TestAttempt() {
	const { id } = useParams();
	const { isPending } = useTestAttemptQuery(id);

	const tick = useTestAttemptStore((s) => s.tick);
	const timeLeft = useTestAttemptStore((s) => s.timeLeft);
	const reset = useTestAttemptStore((s) => s.reset);

	// Timer
	useEffect(() => {
		// Start the timer when the component mounts
		const timerId = setInterval(() => {
			tick();
		}, 1000);

		// Clean up the timer when the component unmounts
		return () => {
			clearInterval(timerId);
		};
	}, [tick]);

	// Effect to handle auto-submit when time runs out
	useEffect(() => {
		if (timeLeft <= 0) {
			// TODO: Handle auto-submission
			console.log("Time is up! Auto-submitting...");
		}
	}, [timeLeft]);

	// Clean up the store on unmount
	useEffect(() => {
		return () => {
			reset();
		};
	}, [reset]);

	if (isPending) {
		return (
			<div className="flex h-screen items-center justify-center">
				<p>Loading Test...</p>
			</div>
		);
	}

	return (
		<div className="flex h-screen overflow-hidden bg-white">
			{/* Column 1: Test Content */}
			<div className="scroll-container flex-[4] overflow-y-auto p-8">
				<TestRenderer />
			</div>

			{/* Column 2: Sidebar */}
			<div className="scroll-container flex-[1] overflow-y-auto border-l border-gray-200">
				<TestSidebar />
			</div>
		</div>
	);
}

export default TestAttempt;
