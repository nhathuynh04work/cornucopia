import { itemTypeEnum, mediaLayouts } from "@/lib/item.config";
import QuestionRenderer from "./QuestionRenderer";
import MediaList from "../Media/MediaList";

function QuestionList({ questions = [] }) {
	return (
		<div className="space-y-8">
			{questions
				.slice()
				.sort((a, b) => a.sortOrder - b.sortOrder)
				.map((childQuestion) => (
					<div
						id={`question-${childQuestion.id}`}
						key={childQuestion.id}>
						<QuestionRenderer question={childQuestion} />
					</div>
				))}
		</div>
	);
}

export default function TestItem({ item }) {
	// --- 1. Define the rendered blocks ---
	let TextBlock, MediaBlock, ContentBlock;

	const mediaListLayout =
		item.mediaLayout === mediaLayouts.FULL_WIDTH_STACKED ? "grid" : "list";

	if (item.type === itemTypeEnum.GROUP) {
		// GROUP
		TextBlock = item.text ? (
			<h2 className="text-lg font-bold text-gray-900">{item.text}</h2>
		) : null;
		MediaBlock = (
			<MediaList
				media={item.media}
				layout={mediaListLayout}
				isEditing={false} // Use read-only list for test attempt
			/>
		);
		ContentBlock = <QuestionList questions={item.children} />;
	} else {
		// STANDALONE QUESTION
		TextBlock = null; // handled by QuestionRenderer
		MediaBlock = (
			<MediaList
				media={item.media}
				layout={mediaListLayout}
				isEditing={false} // Use read-only list for test attempt
			/>
		);
		ContentBlock = <QuestionRenderer question={item} />;
	}

	// --- 2. Render the blocks based on the item's layout ---
	function renderLayout() {
		const scrollColumnClasses =
			"md:max-h-[75vh] overflow-y-auto pr-4 scroll-container";

		switch (item.mediaLayout) {
			// Layout 1: [Text + Media] left | [Content] right
			case mediaLayouts.LEFT_STACKED:
				return (
					<div className={`grid grid-cols-1 md:grid-cols-2 gap-8`}>
						{/* Left Column (Scrolling) */}
						<div className={`space-y-6 ${scrollColumnClasses}`}>
							{TextBlock}
							{MediaBlock}
						</div>
						{/* Right Column (Scrolling) */}
						<div className={scrollColumnClasses}>
							{ContentBlock}
						</div>
					</div>
				);

			// Layout 2: [Text] top | [Media] left | [Content] right
			case mediaLayouts.TEXT_TOP_MEDIA_LEFT:
				return (
					<div className="space-y-6">
						{TextBlock}
						<div
							className={`grid grid-cols-1 md:grid-cols-2 gap-8`}>
							{/* Left Column (Scrolling) */}
							<div className={scrollColumnClasses}>
								{MediaBlock}
							</div>
							{/* Right Column (Scrolling) */}
							<div className={scrollColumnClasses}>
								{ContentBlock}
							</div>
						</div>
					</div>
				);

			// Layout 3 (Default): [Text], [Media], [Content] stacked
			case mediaLayouts.FULL_WIDTH_STACKED:
			default:
				return (
					<div className="space-y-6">
						{TextBlock}
						{MediaBlock}
						{ContentBlock}
					</div>
				);
		}
	}

	// --- 3. Return the layout ---
	if (item.type === itemTypeEnum.GROUP) {
		// --- ADDED STYLING HERE for the group wrapper ---
		return (
			<div className="bg-gray-50 rounded-lg p-6">{renderLayout()}</div>
		);
	}

	// A standalone question needs the scroll ID on its wrapper
	return <div id={`question-${item.id}`}>{renderLayout()}</div>;
}
