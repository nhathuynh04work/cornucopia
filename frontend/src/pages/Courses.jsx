import { Link } from "react-router-dom";
import { Plus, BookOpen } from "lucide-react";
import { useGetCourses } from "@/hooks/useCourseQuery";
import CourseCard from "@/components/Courses/CourseCard";
import PermissionGate from "@/components/PermissionGate";
import { PERMISSIONS } from "@/lib/constants";
import PageHeader from "@/components/Shared/PageHeader";
import FilterBar from "@/components/Shared/FilterBar";
import ResourceList from "@/components/Shared/ResourceList";
import { useAuth } from "@/contexts/AuthContext";
import { useResourceFilters } from "@/hooks/useResourceFilters";

export default function Courses() {
	const { user } = useAuth();

	const {
		searchTerm,
		setSearchTerm,
		debouncedSearch,
		sort,
		setSort,
		scope,
		setScope,
	} = useResourceFilters({ defaultScope: "ALL" });

	const queryParams = {
		search: debouncedSearch,
		sort,
		status: "PUBLIC",
	};

	if (scope === "MINE" && user) {
		queryParams.userId = user.id;
	} else if (scope === "ENROLLED" && user) {
		queryParams.enrolledUserId = user.id;
	}

	const { data: courses, isPending, isError } = useGetCourses(queryParams);

	const tabs = [{ label: "Tất cả", value: "ALL" }];
	if (user) {
		tabs.push(
			{ label: "Của tôi tạo", value: "MINE" },
			{ label: "Đã tham gia", value: "ENROLLED" }
		);
	}

	return (
		<div className="p-6 max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
			<PageHeader
				title="Khám phá Khóa học"
				description="Nâng cao kỹ năng với các khóa học từ những giảng viên hàng đầu."
				action={
					<PermissionGate allowedRoles={PERMISSIONS.CREATE_COURSE}>
						<Link
							to="/courses/create"
							className="inline-flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm rounded-xl transition-colors shadow-sm hover:shadow">
							<Plus className="w-4 h-4" />
							Tạo khóa học
						</Link>
					</PermissionGate>
				}
			/>

			<FilterBar
				searchTerm={searchTerm}
				onSearchChange={setSearchTerm}
				searchPlaceholder="Tìm kiếm khóa học..."
				tabs={tabs}
				activeTab={scope}
				onTabChange={setScope}
				sortOptions={[
					{ label: "Mới nhất", value: "newest" },
					{ label: "Cũ nhất", value: "oldest" },
					{ label: "Giá: Thấp đến Cao", value: "price_asc" },
					{ label: "Giá: Cao đến Thấp", value: "price_desc" },
				]}
				activeSort={sort}
				onSortChange={setSort}
			/>

			<ResourceList
				isLoading={isPending}
				isError={isError}
				data={courses}
				resourceName="khóa học"
				renderItem={(course) => (
					<CourseCard key={course.id} course={course} />
				)}
				emptyState={{
					icon: BookOpen,
					title: "Không tìm thấy khóa học",
					description:
						"Không có khóa học nào phù hợp với tiêu chí tìm kiếm của bạn.",
				}}
			/>
		</div>
	);
}
