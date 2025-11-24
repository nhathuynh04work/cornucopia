import { Link, useNavigate } from "react-router-dom";
import { Plus, BookOpen, AlertCircle, Loader2 } from "lucide-react";
import { useGetCourses } from "@/hooks/useCourseQuery";
import { useCreateCourse } from "@/hooks/useCourseMutation";
import CourseCard from "@/components/Courses/CourseCard";
import PermissionGate from "@/components/PermissionGate";
import { PERMISSIONS, Role } from "@/lib/constants";
import PageHeader from "@/components/Shared/PageHeader";
import FilterBar from "@/components/Shared/FilterBar";
import EmptyState from "@/components/Shared/EmptyState";
import { useAuth } from "@/contexts/AuthContext";
import { useResourceFilters } from "@/hooks/useResourceFilters";
import toast from "react-hot-toast";

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

	const renderContent = () => {
		if (isPending) {
			return (
				<div className="h-96 flex flex-col items-center justify-center text-gray-400">
					<Loader2 className="w-10 h-10 animate-spin mb-3 text-purple-500" />
					<p>Đang tải danh sách khóa học...</p>
				</div>
			);
		}

		if (isError) {
			return (
				<div className="h-96 flex flex-col items-center justify-center text-red-500 bg-red-50 rounded-2xl border border-red-100 p-8">
					<AlertCircle className="w-10 h-10 mb-3" />
					<p>Không thể tải dữ liệu. Vui lòng thử lại sau.</p>
				</div>
			);
		}

		if (!courses || courses.length === 0) {
			return (
				<EmptyState
					icon={BookOpen}
					title="Không tìm thấy khóa học"
					description="Không có khóa học nào phù hợp với tiêu chí tìm kiếm của bạn."
					actionLabel="Tạo khóa học mới"
					onAction={handleCreateCourse}
					allowedRoles={PERMISSIONS.CREATE_COURSE}
				/>
			);
		}

		return (
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
				{courses.map((course) => (
					<CourseCard key={course.id} course={course} />
				))}
			</div>
		);
	};

	const tabs = [{ label: "Tất cả", value: "ALL" }];
	if (user) {
		if (user.role === Role.ADMIN || user.role === Role.CREATOR) {
			tabs.push({ label: "Của tôi tạo", value: "MINE" });
		}
		tabs.push({ label: "Đã tham gia", value: "ENROLLED" });
	}

	return (
		<div className="p-6 max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
			<PageHeader
				title="Khám phá Khóa học"
				description="Nâng cao kỹ năng với các khóa học từ những giảng viên hàng đầu."
				action={
					<PermissionGate allowedRoles={PERMISSIONS.CREATE_COURSE}>
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

			{renderContent()}
		</div>
	);
}
