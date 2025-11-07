import { useState } from "react";
import ModuleHeader from "./ModuleHeader";
import LessonList from "./LessonList";

export default function ModuleItem({ module }) {
	const [isOpen, setIsOpen] = useState(true);

	return (
		<div className="rounded-lg border bg-white shadow-sm">
			<ModuleHeader
				module={module}
				isOpen={isOpen}
				onToggle={() => setIsOpen(!isOpen)}
			/>

			{isOpen && <LessonList module={module} />}
		</div>
	);
}
