import { useTestEditorStore } from "../../store/testEditorStore";
import ItemList from "./ItemList";
import SectionList from "./SectionList";
import TestNavHeader from "./TestNavHeader";

function TestEditorNav({ testId }) {
	const test = useTestEditorStore((s) => s.getEntity("tests", testId));

	return (
		<div className="flex flex-col h-full">
			<TestNavHeader test={test} />
			<SectionList test={test} />
			<ItemList />
		</div>
	);
}

export default TestEditorNav;
