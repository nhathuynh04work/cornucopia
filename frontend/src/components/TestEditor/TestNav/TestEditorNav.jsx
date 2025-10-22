import ItemList from "../ItemList/ItemList";
import TestNavHeader from "./TestNavHeader";

function TestEditorNav() {
	return (
		<div className="flex flex-col h-full">
			<TestNavHeader />
			<div className="flex-1 min-h-0 flex flex-col">
				<ItemList />
			</div>
		</div>
	);
}

export default TestEditorNav;
