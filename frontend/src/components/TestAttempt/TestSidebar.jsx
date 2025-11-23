import { useTestAttemptStore } from "@/store/testAttemptStore";
import { formatTime } from "@/lib/formatters";
import { useNavigate } from "react-router";
import { useSubmitTest } from "@/hooks/useSubmitTest";
import { Loader2, LogOut } from "lucide-react";
import QuestionNav from "./QuestionNav";

function TestSidebar() {
	const test = useTestAttemptStore((s) => s.test);
	const timeLeft = useTestAttemptStore((s) => s.timeLeft);
	const navigate = useNavigate();

	const { submitTest, isSubmitting } = useSubmitTest();

	function handleExit() {
		if (confirm("You sure you wanna leave?")) navigate(`/tests/${test.id}`);
	}

	return (
		<div className="flex h-full flex-col">
			{/* --- Section 1: Title & Time --- */}
			<div className="p-4">
				<h1 className="text-md font-semibold text-gray-900">
					{test.title}
				</h1>
				<div className="flex justify-between items-center mt-6">
					<p className="text-xs font-medium text-gray-600">Time</p>
					<p className="text-md font-medium text-gray-800 rounded-md bg-gray-100 px-2 py-0.5">
						{formatTime(timeLeft)}
					</p>
				</div>
			</div>

			{/* --- Section 2: Buttons (Updated Layout) --- */}
			<div className="flex items-center gap-2 border-y border-gray-200 p-4">
				<button
					onClick={handleExit}
					disabled={isSubmitting}
					className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:opacity-50"
					aria-label="Exit Test">
					<LogOut className="h-3.5 w-3.5" />
				</button>

				<button
					onClick={submitTest}
					disabled={isSubmitting}
					className="flex-1 rounded-md bg-gray-800 px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center h-9">
					{isSubmitting ? (
						<Loader2 className="h-4 w-4 animate-spin" />
					) : (
						"Submit"
					)}
				</button>
			</div>

			{/* --- Section 3: Question Nav --- */}
			<div className="p-4">
				<h3 className="text-xs font-semibold uppercase text-gray-500">
					Questions
				</h3>
			</div>

			<div className="flex-1 overflow-y-auto px-4 pb-4 scroll-container">
				<QuestionNav />
			</div>
		</div>
	);
}

export default TestSidebar;
