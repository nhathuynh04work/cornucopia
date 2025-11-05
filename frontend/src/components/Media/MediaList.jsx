import MediaItem from "./MediaItem";

// classes for the LIST container
const listLayoutClasses = {
	list: "grid grid-cols-1 gap-4 pb-4 w-full", // Constrained list
	grid: "grid grid-cols-2 gap-3 pb-4", // Grid
};


export default function MediaList({
	media,
	layout = "grid",
	isEditing = true,
}) {
	if (!media || media.length === 0) {
		return null;
	}

	// Select the correct class for the list
	const listClass = listLayoutClasses[layout] || listLayoutClasses.grid;

	return (
		<div className={listClass}>
			{media.map((mediaItem) => (
				<MediaItem
					key={mediaItem.id}
					media={mediaItem}
					// className prop is no longer passed
					isEditing={isEditing}
				/>
			))}
		</div>
	);
}
