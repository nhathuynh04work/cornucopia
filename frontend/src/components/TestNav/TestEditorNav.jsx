import { useTestEditorStore } from "../../store/testEditorStore";
import ItemList from "./ItemList/ItemList";
import SectionList from "./SectionList/SectionList";
import TestNavHeader from "./TestNavHeader";

function TestEditorNav({ testId }) {
	const test = useTestEditorStore((s) => s.getEntity("tests", testId));

	if (!test) return <p>Loading</p>;

	return (
		<div className="flex flex-col h-full bg-gray-50/50">
			<TestNavHeader test={test} />
			<div className="flex-1 min-h-0 flex flex-col">
				<SectionList test={test} />
				<ItemList />
			</div>
		</div>
	);
}

export default TestEditorNav;
