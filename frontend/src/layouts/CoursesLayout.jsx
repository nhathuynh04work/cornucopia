import CoursesHeader from "@/components/Courses/CoursesHeader";
import { useAuth } from "@/contexts/AuthContext";
import { useMemo } from "react";
import { Outlet, useSearchParams } from "react-router-dom";

const tabs = [
	{ title: "All Courses", key: "all", path: "/courses/all" },
	{ title: "Enrolled", key: "enrolled", path: "/courses/enrolled" },
];

function CoursesLayout() {
	const { role } = useAuth();
	const [searchParams, setSearchParams] = useSearchParams();
	const searchTerm = searchParams.get("q") || "";

	const visibleTabs = useMemo(() => {
		if (role === "admin") {
			return [
				...tabs,
				{ title: "My Courses", key: "admin", path: "/courses/admin" },
			];
		}
		return tabs;
	}, [role]);

	const handleSearchChange = (e) => {
		const q = e.target.value;
		if (q) {
			setSearchParams({ q }, { replace: true });
		} else {
			setSearchParams({}, { replace: true });
		}
	};

	return (
		<div className="p-6 bg-white w-5/6 mx-auto">
			<CoursesHeader
				tabs={visibleTabs}
				searchTerm={searchTerm}
				onSearchChange={handleSearchChange}
			/>
			<div className="mt-6">
				<Outlet context={{ searchTerm }} />
			</div>
		</div>
	);
}

export default CoursesLayout;
