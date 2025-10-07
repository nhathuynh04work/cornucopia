import SectionListContent from "./SectionListContent";
import SectionListHeader from "./SectionListHeader";

function SectionList() {
	return (
		<section className="h-1/4 border-b flex flex-col">
			{/* Sticky header */}
			<SectionListHeader />

			{/* Scrollable list */}
			<SectionListContent />
		</section>
	);
}

export default SectionList;
