import { useParams } from "react-router";
import { useTestEditorQuery } from "../hooks/useTestEditorQuery";
import TestEditorNav from "../components/TestNav/TestEditorNav";
import TestItemSettings from "../components/TestItemSettings";
import { useTestEditorStore } from "../store/testEditorStore";
import TestEditor from "../components/TestEditor/TestEditor";

function TestEdit() {
	const { id } = useParams();
	const { isLoading, isError } = useTestEditorQuery(id);
	const test = useTestEditorStore((s) => s.test);

	if (isLoading || !test)
		return (
			<div className="flex justify-center items-center h-screen text-gray-500 animate-pulse">
				Loading editor...
			</div>
		);

	if (isError)
		return (
			<p className="text-center text-red-500 mt-8">
				Something went wrong
			</p>
		);

	return (
		<div className="grid grid-cols-12 h-screen bg-gray-50">
			{/* Left navigation */}
			<aside className="col-span-2 border-r bg-white shadow-sm overflow-hidden">
				<TestEditorNav />
			</aside>

			{/* Main editor */}
			<main className="col-span-8 bg-white p-6 overflow-y-auto shadow-inner">
				<div className="h-full flex items-center">
					<TestEditor />
				</div>
			</main>

			{/* Settings panel */}
			<aside className="col-span-2 border-l bg-white shadow-sm p-6">
				<TestItemSettings />
			</aside>
		</div>
	);
}

export default TestEdit;
