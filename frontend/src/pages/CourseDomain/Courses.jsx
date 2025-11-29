import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import CourseCard from "@/components/Courses/CourseCard";
import CourseFilterSidebar from "@/components/Courses/CourseFilterSidebar";
import PermissionGate from "@/components/Shared/PermissionGate";
import PaginationControl from "@/components/Shared/PaginationControl";
import ResourcePageLayout from "@/layouts/ResourcePageLayout";
import EmptyState from "@/components/Shared/EmptyState";
import { PERMISSIONS } from "@/lib/constants";
import { useGetCourses } from "@/hooks/useCourseQuery";
import { useResourceFilters } from "@/hooks/useResourceFilters";

const SORT_OPTIONS = [
	{ value: "popular", label: "Phổ biến nhất" },
	{ value: "newest", label: "Mới nhất" },
	{ value: "rating", label: "Đánh giá cao nhất" },
	{ value: "price_asc", label: "Giá thấp đến cao" },
	{ value: "price_desc", label: "Giá cao đến thấp" },
];

export default function Courses() {
	const navigate = useNavigate();

	const {
		searchTerm,
		setSearchTerm,
		debouncedSearch,
		sort,
		setSort,
		page,
		setPage,
		limit,
		filters,
		setFilter,
		toggleFilterArray,
		clearFilters,
	} = useResourceFilters({ defaultSort: "newest", defaultLimit: 6 });

	const queryParams = useMemo(
		() => ({
			search: debouncedSearch,
			level: filters.level,
			language: filters.language,
			rating: filters.rating,
			price: filters.price,
			sort,
			page,
			limit,
		}),
		[debouncedSearch, filters, sort, page, limit]
	);

	const { data: coursesData, isLoading } = useGetCourses(queryParams);

	const courses = coursesData?.data || [];
	const pagination = coursesData?.pagination || {
		totalItems: 0,
		totalPages: 1,
		currentPage: 1,
	};

	return (
		<ResourcePageLayout
			title="Thư viện khóa học"
			description="Nâng cao kỹ năng với hơn 500+ khóa học từ các chuyên gia hàng đầu."
			action={
				<PermissionGate allowedRoles={PERMISSIONS.CREATE_COURSE}>
					<button
						onClick={() => navigate("/courses/new")}
						className="inline-flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm rounded-xl transition-colors shadow-sm hover:shadow">
						<Plus className="w-4 h-4" />
						Tạo khóa học
					</button>
				</PermissionGate>
			}
			searchTerm={searchTerm}
			onSearchChange={(e) => setSearchTerm(e.target.value)}
			searchPlaceholder="Tìm kiếm khóa học..."
			sort={sort}
			onSortChange={setSort}
			sortOptions={SORT_OPTIONS}
			totalItems={pagination.totalItems}
			itemLabel="khóa học"
			filterContent={
				<CourseFilterSidebar
					filters={filters}
					setFilter={setFilter}
					toggleFilterArray={toggleFilterArray}
					clearFilters={clearFilters}
				/>
			}
			isLoading={isLoading}
			pagination={
				courses.length > 0 && (
					<PaginationControl
						currentPage={pagination.currentPage}
						totalPages={pagination.totalPages}
						onPageChange={setPage}
					/>
				)
			}>
			{courses.length > 0 ? (
				<div className="grid grid-cols-1 gap-4">
					{courses.map((course) => (
						<div key={course.id}>
							<CourseCard course={course} />
						</div>
					))}
				</div>
			) : (
				!isLoading && (
					<EmptyState
						icon={Search}
						title="Không tìm thấy kết quả"
						description="Không có khóa học nào phù hợp với bộ lọc hiện tại.">
						<button
							onClick={clearFilters}
							className="text-purple-600 font-bold hover:underline">
							Xóa tất cả bộ lọc
						</button>
					</EmptyState>
				)
			)}
		</ResourcePageLayout>
	);
}
