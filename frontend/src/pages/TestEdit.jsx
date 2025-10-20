import { useParams } from "react-router";
import TestEditorNav from "../components/TestEditor/TestNav/TestEditorNav";
import TestEditor from "../components/TestEditor/TestEditor/TestEditor";
import { useTestEditorQuery } from "@/hooks/useTestEditorQuery";
import TestItemSettings from "@/components/TestEditor/TestItemSettings/TestItemSettings";

function TestEdit() {
	const { id } = useParams();
	const { isLoading, isError } = useTestEditorQuery(id);

	if (isLoading)
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
		<div className="grid grid-cols-12 h-screen bg-gray-50/50">
			{/* Left navigation */}
			<aside className="col-span-2 border-r shadow-sm overflow-hidden">
				<TestEditorNav />
			</aside>

			{/* Main editor */}
			<main className="col-span-8 bg-white p-6 overflow-y-auto shadow-inner">
				<div className="h-full flex items-center">
					<TestEditor />
				</div>
			</main>

			{/* Settings panel */}
			<aside className="col-span-2 border-l overflow-hidden">
				<TestItemSettings />
			</aside>
		</div>
	);
}

export default TestEdit;
