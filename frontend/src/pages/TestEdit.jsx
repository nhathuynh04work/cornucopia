import { Navigate, useParams } from "react-router";
import TestEditorNav from "../components/TestEditor/TestNav/TestEditorNav";
import TestEditor from "../components/TestEditor/TestEditor/TestEditor";
import TestItemSettings from "@/components/TestEditor/TestItemSettings/TestItemSettings";
import { useAuth } from "@/contexts/AuthContext";
import { useGetTestForEdit } from "@/hooks/useTestQuery";

function TestEdit() {
	const { testId } = useParams();
	const { isLoading: isTestLoading, isError } = useGetTestForEdit(testId);

	const { user, isInitialLoading } = useAuth();

	if (isInitialLoading) {
		return (
			<div className="flex justify-center items-center h-screen text-gray-500">
				Checking authentication...
			</div>
		);
	}

	if (!user) {
		return <Navigate to="/" />;
	}

	if (isTestLoading)
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
		<div className="fixed inset-0 grid grid-cols-12 bg-gray-50/50">
			{/* Left navigation */}
			<aside className="col-span-2 border-r shadow-sm h-full overflow-hidden">
				<TestEditorNav />
			</aside>

			{/* Main editor */}
			<main className="col-span-8 bg-white p-6 overflow-y-auto shadow-inner">
				<div className="h-full flex items-center">
					<TestEditor />
				</div>
			</main>

			{/* Settings panel */}
			<aside className="col-span-2 border-l h-full overflow-hidden">
				<TestItemSettings />
			</aside>
		</div>
	);
}

export default TestEdit;
