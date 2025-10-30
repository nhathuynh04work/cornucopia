import ModuleHeader from "./ModuleHeader";
import LessonList from "./LessonList";

export default function ModuleItem({ module }) {
	return (
		<div className="rounded-lg border border-gray-200 bg-white shadow-sm">
			<ModuleHeader module={module} />
			<LessonList lessons={module.lessons} />
		</div>
	);
}
