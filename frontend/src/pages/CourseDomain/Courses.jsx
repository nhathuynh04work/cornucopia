import { useNavigate } from "react-router-dom";
import { Plus, BookOpen } from "lucide-react";
import { useGetCourses } from "@/hooks/useCourseQuery";
import { useCreateCourse } from "@/hooks/useCourseMutation";
import CourseCard from "@/components/Courses/CourseCard";
import PermissionGate from "@/components/Shared/PermissionGate";
import { PERMISSIONS, Role } from "@/lib/constants";
import PageHeader from "@/components/Shared/PageHeader";
import FilterBar from "@/components/Shared/FilterBar";
import ResourceList from "@/components/Shared/ResourceList";
import { useAuth } from "@/contexts/AuthContext";
import { useResourceFilters } from "@/hooks/useResourceFilters";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

export default function Courses() {
	const { user } = useAuth();
	const navigate = useNavigate();

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
		status: scope === "MINE" ? undefined : "PUBLIC",
	};

	if (scope === "MINE" && user) {
		queryParams.userId = user.id;
	} else if (scope === "ENROLLED" && user) {
		queryParams.enrolledUserId = user.id;
	}

	const { data: courses, isPending, isError } = useGetCourses(queryParams);
	const { mutate: createCourse, isPending: isCreating } = useCreateCourse();

	function handleCreateCourse() {
		createCourse(
			{},
			{
				onSuccess: (course) => {
					navigate(`/courses/${course.id}/edit`);
					toast.success("Tạo khóa học mới thành công!");
				},
			}
		);
	}

	const tabs = [{ label: "Tất cả", value: "ALL" }];
	if (user) {
		if (user.role === Role.ADMIN || user.role === Role.CREATOR) {
			tabs.push({ label: "Của tôi tạo", value: "MINE" });
		}
		tabs.push({ label: "Đã tham gia", value: "ENROLLED" });
	}

	return (
		<div className="max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
			<div className="px-6 pt-6">
				<PageHeader
					title="Khám phá Khóa học"
					description="Nâng cao kỹ năng với các khóa học từ những giảng viên hàng đầu."
					action={
						<PermissionGate
							allowedRoles={PERMISSIONS.CREATE_COURSE}>
							<button
								onClick={handleCreateCourse}
								disabled={isCreating}
								className="inline-flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm rounded-xl transition-colors shadow-sm hover:shadow disabled:opacity-70">
								{isCreating ? (
									<Loader2 className="w-4 h-4 animate-spin" />
								) : (
									<Plus className="w-4 h-4" />
								)}
								Tạo khóa học
							</button>
						</PermissionGate>
					}
				/>
			</div>

			<div className="sticky top-0 z-20 bg-gray-50/95 backdrop-blur-md px-6 py-4 transition-all duration-200">
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
			</div>

			<div className="px-6 pb-6">
				<ResourceList
					isLoading={isPending}
					isError={isError}
					data={courses}
					resourceName="khóa học"
					gridCols="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
					renderItem={(course) => (
						<CourseCard key={course.id} course={course} />
					)}
					emptyState={{
						icon: BookOpen,
						title: "Không tìm thấy khóa học",
						description:
							"Không có khóa học nào phù hợp với tiêu chí tìm kiếm của bạn.",
						actionLabel: "Tạo khóa học mới",
						onAction: handleCreateCourse,
						allowedRoles: PERMISSIONS.CREATE_COURSE,
					}}
				/>
			</div>
		</div>
	);
}
