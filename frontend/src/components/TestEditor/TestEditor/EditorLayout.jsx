import { mediaLayouts } from "@/lib/item.config";

export default function EditorLayout({
	mediaLayout,
	textBlock,
	mediaBlock,
	contentBlock,
}) {
	switch (mediaLayout) {
		// Layout 1: [Text + Media] left | [Content] right
		case mediaLayouts.LEFT_STACKED:
			return (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
					{/* Left Column */}
					<div className="space-y-6">
						{textBlock}
						{mediaBlock}
					</div>
					{/* Right Column */}
					<div className="h-full">{contentBlock}</div>
				</div>
			);

		// Layout 2: [Text] top | [Media] left | [Content] right
		case mediaLayouts.TEXT_TOP_MEDIA_LEFT:
			return (
				<div className="space-y-6">
					{/* Top Row */}
					{textBlock}
					{/* Bottom Row (2-col) */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
						{/* Left Column */}
						{mediaBlock}
						{/* Right Column */}
						<div className="h-full">{contentBlock}</div>
					</div>
				</div>
			);

		// Layout 3 (Default): [Text], [Media], [Content] stacked
		case mediaLayouts.FULL_WIDTH_STACKED:
		default:
			return (
				<div className="space-y-6">
					{textBlock}
					{mediaBlock}
					{contentBlock}
				</div>
			);
	}
}
