// src/components/TestInfo/TestInfoSidebar.jsx
import TestAboutSection from "./TestAboutSection";
import TestAttemptHistory from "./TestAttemptHistory";

function TestInfoSidebar({ test }) {
	return (
		// REMOVED: Padding and overflow classes from here
		<div className="flex-1 bg-gray-50 border-l border-gray-200 overflow-y-auto scroll-container">
			{/* Component 1: About */}
			<TestAboutSection test={test} />

			{/* Component 2: History */}
			<TestAttemptHistory testId={test.id} />

			{/* You can add more sections here easily */}
		</div>
	);
}

export default TestInfoSidebar;
