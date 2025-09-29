import { useParams } from "react-router";
import { useTestEditorQuery } from "../hooks/useTestEditorQuery";
import { useEffect } from "react";
import { useTestEditorStore } from "../store/testEditorStore";
import TestEditor from "../components/TestEditor";
import QuestionListNav from "../components/QuestionListNav";

function TestEdit() {
	const { id } = useParams();
	const { data, isLoading, error } = useTestEditorQuery(id);

	const loadTest = useTestEditorStore((s) => s.loadTest);
	const test = useTestEditorStore((s) => s.getEntity("tests", id));

	useEffect(() => {
		if (!data?.entities) return;
		loadTest(data);
	}, [data, loadTest]);

	if (isLoading) return <p>Loading…</p>;
	if (error) return <p>{error.message ?? "Something went wrong"}</p>;

	if (!test) return <p>No test found</p>;

	return (
		<div className="flex">
			<div className="w-5/6">
				<TestEditor id={id} />
			</div>
			<div className="w-1/6 sticky top-0 h-screen overflow-y-auto">
				<QuestionListNav />
			</div>
		</div>
	);
}

export default TestEdit;
