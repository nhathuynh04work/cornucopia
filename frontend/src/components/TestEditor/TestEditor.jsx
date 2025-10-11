import { useTestEditorStore } from "../../store/testEditorStore";

function TestEditor() {
	const currentItem = useTestEditorStore((s) => s.getCurrentItem());

	return (
		<div className="bg-red-100 h-2/3 w-full rounded-xl">
			{currentItem?.id}
		</div>
	);
}

export default TestEditor;
