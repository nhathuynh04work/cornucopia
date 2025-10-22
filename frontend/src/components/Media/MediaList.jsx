import MediaItem from "./MediaItem";

// classes for the LIST container
const listLayoutClasses = {
	list: "grid grid-cols-1 gap-4 pb-4 w-full", // Constrained list
	grid: "grid grid-cols-2 gap-3 pb-4", // Grid
};

// classes for the ITEM itself
const itemLayoutClasses = {
	list: "aspect-auto",
	grid: "aspect-video",
};

export default function MediaList({
	media,
	layout = "grid",
	isEditing = true,
}) {
	if (!media || media.length === 0) {
		return null;
	}

	// Select the correct class for the list AND the item
	const listClass = listLayoutClasses[layout] || listLayoutClasses.grid;
	const itemClass = itemLayoutClasses[layout] || itemLayoutClasses.grid;

	return (
		<div className={listClass}>
			{media.map((mediaItem) => (
				<MediaItem
					key={mediaItem.id}
					media={mediaItem}
					className={itemClass}
					isEditing={isEditing}
				/>
			))}
		</div>
	);
}
