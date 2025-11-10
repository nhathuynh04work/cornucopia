import { useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import TabsSearchbarLayout from "./TabSearchbarLayout";
import { Role } from "@/lib/constants";

const TABS = {
	ALL: { title: "All Courses", key: "all", path: "/courses/all" },
	ENROLLED: { title: "Enrolled", key: "enrolled", path: "/courses/enrolled" },
	MY_COURSES: { title: "My Courses", key: "admin", path: "/courses/admin" },
};

function CoursesLayout() {
	const { role } = useAuth();

	const visibleTabs = useMemo(() => {
		// For admin/creator
		if (role === Role.ADMIN || role === Role.CREATOR) {
			return [TABS.ALL, TABS.ENROLLED, TABS.MY_COURSES];
		}

		// For a logged-in user
		if (role === Role.USER) {
			return [TABS.ALL, TABS.ENROLLED];
		}

		// For a visitor (not logged in)
		// This handles role being null, undefined, "visitor", etc.
		return [TABS.ALL];
	}, [role]);

	return (
		<TabsSearchbarLayout
			tabs={visibleTabs}
			searchPlaceholder="Search courses..."
		/>
	);
}

export default CoursesLayout;
