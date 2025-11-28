import {
	BasicInfoSection,
	MediaSection,
	SettingsSection,
} from "./CourseInfoSections";

export default function CourseInfoEditor({ course, onChange }) {
	return (
		<div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
			<div className="flex flex-col lg:flex-row gap-8 items-start">
				<div className="flex-1 space-y-8 w-full order-2 lg:order-1">
					<BasicInfoSection course={course} onChange={onChange} />
				</div>
				<div className="w-full lg:w-[360px] space-y-6 shrink-0 lg:sticky lg:top-4 order-1 lg:order-2">
					<MediaSection course={course} onChange={onChange} />
					<SettingsSection course={course} onChange={onChange} />
				</div>
			</div>
		</div>
	);
}
