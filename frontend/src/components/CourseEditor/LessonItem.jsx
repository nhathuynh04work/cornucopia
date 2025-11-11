import { useState } from "react";
import LessonHeader from "./LessonHeader";
import LessonContent from "./LessonContent";

export default function LessonItem({ lesson }) {
	const [isEditingContent, setIsEditingContent] = useState(false);

	return (
		<div className="relative group rounded-md border border-gray-200 bg-gray-50">
			<LessonHeader
				lesson={lesson}
				isEditingContent={isEditingContent}
				onToggle={() => setIsEditingContent((e) => !e)}
			/>

			{isEditingContent && <LessonContent lesson={lesson} />}
		</div>
	);
}
