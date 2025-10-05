import SectionListContent from "./SectionListContent";
import SectionListHeader from "./SectionListHeader";

function SectionList({ test }) {
	return (
		<section className="h-1/4 border-b flex flex-col">
			{/* Sticky header */}
			<SectionListHeader testId={test?.id} />

			{/* Scrollable list */}
			<SectionListContent sections={test?.testSections} />
		</section>
	);
}

export default SectionList;
