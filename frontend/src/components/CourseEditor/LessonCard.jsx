import { useState, useEffect } from "react";
import clsx from "clsx";
import LessonHeader from "./LessonHeader";
import VideoLessonEditor from "./VideoLessonEditor";
import SimpleRichTextEditor from "@/components/Shared/SimpleRichTextEditor";
import { getReadingTime } from "@/lib/getReadingTime";

export default function LessonCardEditor({
	lesson,
	index,
	courseStatus,
	onChange,
	onDelete,
	isActive,
	cardRef,
}) {
	const [isExpanded, setIsExpanded] = useState(false);

	useEffect(() => {
		if (isActive) setIsExpanded(true);
	}, [isActive]);

	return (
		<div
			ref={cardRef}
			className="bg-white rounded-xl border border-gray-200 transition-all duration-300 scroll-mt-24 overflow-hidden">
			<LessonHeader
				lesson={lesson}
				index={index}
				isExpanded={isExpanded}
				courseStatus={courseStatus}
				onToggleExpand={() => setIsExpanded(!isExpanded)}
				onChange={onChange}
				onDelete={onDelete}
			/>

			<div
				className={clsx(
					"grid transition-[grid-template-rows] duration-300 ease-in-out",
					isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
				)}>
				<div className="overflow-hidden">
					<div className="p-6 bg-gray-50/50 border-t border-gray-100">
						{lesson.type === "VIDEO" ? (
							<VideoLessonEditor
								lesson={lesson}
								onChange={onChange}
							/>
						) : (
							<div className="flex flex-col h-full">
								<label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 block">
									Nội dung
								</label>
								<SimpleRichTextEditor
									value={lesson.htmlContent || ""}
									onChange={(newContent) =>
										onChange({
											htmlContent: newContent,
											duration:
												getReadingTime(newContent),
										})
									}
									placeholder="Viết nội dung bài học..."
									className="min-h-[300px] bg-white rounded-lg border border-gray-200"
								/>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
