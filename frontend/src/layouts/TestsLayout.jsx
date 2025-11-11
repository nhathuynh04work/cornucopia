import { useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import TabsSearchbarLayout from "./TabSearchbarLayout";
import { Role } from "@/lib/constants";

const TABS = {
	ALL: { title: "All Tests", key: "all", path: "/tests/all" },
	ATTEMPTED: {
		title: "Attempted",
		key: "attempted",
		path: "/tests/attempted",
	},
	MY_TESTS: { title: "My Tests", key: "admin", path: "/tests/admin" },
};

function TestsLayout() {
	const { role } = useAuth();

	const visibleTabs = useMemo(() => {
		// For admin/creator
		if (role === Role.ADMIN || role === Role.CREATOR) {
			return [TABS.ALL, TABS.ATTEMPTED, TABS.MY_TESTS];
		}

		// For a logged-in user
		if (role === Role.USER) {
			return [TABS.ALL, TABS.ATTEMPTED];
		}

		// For a visitor (not logged in)
		return [TABS.ALL];
	}, [role]);

	return (
		<TabsSearchbarLayout
			tabs={visibleTabs}
			searchPlaceholder="Search tests..."
		/>
	);
}

export default TestsLayout;
