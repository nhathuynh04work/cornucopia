import { useParams } from "react-router";
import { useTestEditorQuery } from "../hooks/useTestEditorQuery";
import { useTestEditorStore } from "../store/testEditorStore";
import TestEditorNav from "../components/TestEditorNav";
import TestEditor from "../components/TestEditor";
import TestItemSettings from "../components/TestItemSettings";

function TestEdit() {
	const { id } = useParams();
	const { isLoading, isError } = useTestEditorQuery(id);
	const test = useTestEditorStore((s) => s.getEntity("tests", id));

	if (isLoading) return <p>Loading...</p>;
	if (isError) return <p>Something went wrong</p>;

	return (
		<div className="grid grid-cols-10 grid-rows-1 h-screen">
			<div className="col-span-2 bg-red-100">
				<TestEditorNav test={test} />
			</div>

			<div className="col-span-6 col-start-3 bg-green-100">
				<TestEditor />
			</div>
			<div className="col-span-2 col-start-9 bg-yellow-100">
				<TestItemSettings />
			</div>
		</div>
	);
}

export default TestEdit;
