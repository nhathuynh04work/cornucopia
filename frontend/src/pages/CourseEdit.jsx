import { useState } from "react";
import { useParams } from "react-router-dom";
import { useCourseEditorQuery } from "@/hooks/useCourseQuery";
import { LayoutDashboard, ListVideo, Settings } from "lucide-react";
import EditSidebarButton from "@/components/CourseEditor/EditSidebarButton";
import CourseInfoEditor from "@/components/CourseEditor/CourseInfoEditor";
import CourseCurriculumEditor from "@/components/CourseEditor/CourseCurriculumEditor";
import CourseSettings from "@/components/CourseEditor/CourseSettings";

function CourseEdit() {
	const { id } = useParams();
	const [activeTab, setActiveTab] = useState("info");

	const { isPending, isError } = useCourseEditorQuery(id);

	if (isPending) {
		return <p className="p-6">Loading course data...</p>;
	}

	if (isError) {
		return <p className="p-6">Error: Course not found.</p>;
	}

	return (
		<div className="flex h-[calc(100vh-65px)] overflow-hidden bg-white">
			{/* --- Sidebar Navigation --- */}
			<nav className="w-64 flex-shrink-0 border-r border-gray-200 bg-white p-4">
				<div className="space-y-2">
					<EditSidebarButton
						icon={<LayoutDashboard className="w-5 h-5" />}
						isActive={activeTab === "info"}
						onClick={() => setActiveTab("info")}>
						General
					</EditSidebarButton>
					<EditSidebarButton
						icon={<ListVideo className="w-5 h-5" />}
						isActive={activeTab === "curriculum"}
						onClick={() => setActiveTab("curriculum")}>
						Curriculum
					</EditSidebarButton>
					<EditSidebarButton
						icon={<Settings className="w-5 h-5" />}
						isActive={activeTab === "settings"}
						onClick={() => setActiveTab("settings")}>
						Settings
					</EditSidebarButton>
				</div>
			</nav>

			{/* --- Main Content Area --- */}
			<main className="flex-1 overflow-y-auto scroll-container p-8 bg-gray-50">
				{activeTab === "info" && <CourseInfoEditor />}
				{activeTab === "curriculum" && <CourseCurriculumEditor />}
				{activeTab === "settings" && <CourseSettings />}
			</main>
		</div>
	);
}

export default CourseEdit;
