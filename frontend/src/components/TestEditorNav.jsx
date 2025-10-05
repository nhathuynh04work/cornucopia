import {
	useAddItemMutation,
	useAddSectionMutation,
} from "../hooks/useSectionMutation";
import { useTestEditorStore } from "../store/testEditorStore";

function TestEditorNav({ testId }) {
	const { mutate: addSection } = useAddSectionMutation(testId);
	const currentSection = useTestEditorStore((s) => s.currentSection);
	const test = useTestEditorStore((s) => s.getEntity("tests", testId));
	const changeCurrentSection = useTestEditorStore(
		(s) => s.changeCurrentSection
	);
	const { mutate: addItem } = useAddItemMutation(currentSection?.id);

	return (
		<div className="flex flex-col h-full">
			<div className="flex flex-col p-3 border-b">
				<div className="flex justify-between mb-2">
					<button>Home</button>
					<button>Setting</button>
				</div>
				<div className="">
					<h2>{test?.title}</h2>
				</div>
			</div>

			<div className="h-1/4 border-b overflow-y-auto p-3">
				<div className="flex justify-between">
					<h2>Sections</h2>

					<button onClick={addSection}>+ Add</button>
				</div>

				<div className="flex flex-col">
					{test?.testSections.map((sectionId) => (
						<div
							key={sectionId}
							onClick={() => changeCurrentSection(sectionId)}>
							{sectionId}
						</div>
					))}
				</div>
			</div>
			<div className="flex-1 bg-yellow-100 overflow-y-auto p-3">
				<div className="flex justify-between">
					<p>Items</p>

					<button
						onClick={() =>
							addItem({
								type: "question",
								questionType: "multiple_choice",
							})
						}>
						Add item
					</button>
				</div>
				<div>
					<p>{currentSection?.title}</p>
					<div className="flex flex-col">
						{currentSection?.items?.map((itemId) => (
							<div key={itemId}>{itemId}</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

export default TestEditorNav;
