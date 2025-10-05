import { useAddSectionMutation } from "../hooks/useSectionMutation";

function TestEditorNav({ test }) {
	const { mutate: addSection } = useAddSectionMutation(test.id);

	return (
		<div className="flex flex-col h-full">
			<div className="flex flex-col border-b">
				<div className="flex justify-between p-4">
					<button>Home</button>
					<button>Setting</button>
				</div>
				<div className="p-4 pt-0">
					<h2>{test?.title}</h2>
				</div>
			</div>

			<div className="h-1/4 border-b overflow-y-auto">
				<div className="flex justify-between">
					<h2>Sections</h2>

					<button onClick={addSection}>+ Add</button>
				</div>

				<div className="flex flex-col gap2">
					{test?.testSections.map((sectionId) => (
						<div key={sectionId}>{sectionId}</div>
					))}
				</div>
			</div>
			<div className="flex-1 bg-yellow-100 overflow-y-auto">
				<p>Items</p>
			</div>
		</div>
	);
}

export default TestEditorNav;
