import { useTestAttemptStore } from "@/store/testAttemptStore";
import MediaList from "../Media/MediaList";
import TestItem from "./TestItem";

function TestRenderer() {
	const items = useTestAttemptStore((s) => s.items);
	const test = useTestAttemptStore((s) => s.test);

	return (
		<div className="space-y-8">
			<MediaList media={test.media} layout="list" isEditing={false} />

			{items.map((item) => (
				<TestItem key={item.id} item={item} />
			))}
		</div>
	);
}

export default TestRenderer;
