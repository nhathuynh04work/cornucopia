import MediaList from "@/components/Media/MediaList";
import ItemMediaLayoutSwitch from "./ItemMediaLayoutSwitch";
import ItemMediaUploader from "./ItemMediaUploader";

export default function ItemSettingsMedia({ currentItem }) {
	return (
		<>
			<ItemMediaLayoutSwitch currentItem={currentItem} />
			<MediaList media={currentItem.media} />
			<ItemMediaUploader currentItem={currentItem} />
		</>
	);
}
