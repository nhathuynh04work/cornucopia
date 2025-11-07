import ModuleHeader from "./ModuleHeader";
import LessonList from "./LessonList";

export default function ModuleItem({ module }) {
	return (
		<div className="rounded-lg border bg-white shadow-sm">
			<ModuleHeader module={module} />
			<LessonList module={module} />
		</div>
	);
}
