import MediaItem from "./MediaItem";

// 1. Define the layout classes inside this component
const listLayoutClasses = {
	list: "grid grid-cols-1 gap-4 pb-4 w-full mx-auto",
	grid: "grid grid-cols-2 gap-3 pb-4",
};

// 2. Define the *item* classes that correspond to each layout
const itemLayoutClasses = {
	list: "aspect-auto", // Allows 9:16 photos to show full height
	grid: "aspect-video", // Forces 16:9 for a uniform grid
};

export default function MediaList({ media, layout = "list" }) {
	if (!media || media.length === 0) {
		return null;
	}

	// 3. Select the correct classes based on the layout prop
	const listClass = listLayoutClasses[layout] || listLayoutClasses.list;
	const itemClass = itemLayoutClasses[layout] || itemLayoutClasses.list;

	return (
		<div className={listClass}>
			{media.map((mediaItem) => (
				<MediaItem
					key={mediaItem.id}
					media={mediaItem}
					className={itemClass} // 4. Pass the correct item class down
				/>
			))}
		</div>
	);
}
