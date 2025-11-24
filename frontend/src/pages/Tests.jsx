import { useNavigate } from "react-router";
import { Plus, FileQuestion, AlertCircle, Loader2 } from "lucide-react";
import { useGetTests } from "@/hooks/useTestQuery";
import { useCreateTest } from "@/hooks/useTestMutation";
import PermissionGate from "@/components/PermissionGate";
import { PERMISSIONS, Role } from "@/lib/constants";
import PageHeader from "@/components/Shared/PageHeader";
import FilterBar from "@/components/Shared/FilterBar";
import EmptyState from "@/components/Shared/EmptyState";
import { useAuth } from "@/contexts/AuthContext";
import { useResourceFilters } from "@/hooks/useResourceFilters";
import toast from "react-hot-toast";
import TestCard from "@/components/Tests/TestCard";

export default function Tests() {
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
	} = useResourceFilters();

	const queryParams = {
		search: debouncedSearch,
		sort,
		scope: scope,
		isPublic: scope === "MINE" ? undefined : true,
	};

	if (scope === "MINE" && user) {
		queryParams.userId = user.id;
	}

	const { data: tests, isPending, isError } = useGetTests(queryParams);
	const { mutate: createTest, isPending: isCreating } = useCreateTest();

	function handleCreateTest() {
		createTest(
			{ title: "Bài kiểm tra mới", description: "" },
			{
				onSuccess: (test) => {
					navigate(`/tests/${test.id}/edit`);
				},
				onError: () => {
					toast.error("Không thể tạo bài thi mới");
				},
			}
		);
	}

	const renderContent = () => {
		if (isPending) {
			return (
				<div className="h-96 flex flex-col items-center justify-center text-gray-400">
					<Loader2 className="w-10 h-10 animate-spin mb-3 text-purple-500" />
					<p>Đang tải bài kiểm tra...</p>
				</div>
			);
		}

		if (isError) {
			return (
				<div className="h-96 flex flex-col items-center justify-center text-red-500 bg-red-50 rounded-2xl border border-red-100 p-8">
					<AlertCircle className="w-10 h-10 mb-3" />
					<p>Lỗi khi tải dữ liệu.</p>
				</div>
			);
		}

		if (!tests || tests.length === 0) {
			return (
				<EmptyState
					icon={FileQuestion}
					title="Không tìm thấy bài kiểm tra"
					description={
						scope === "ATTEMPTED"
							? "Bạn chưa làm bài kiểm tra nào. Hãy thử sức với một bài thi ngay!"
							: "Không có bài kiểm tra nào phù hợp với tiêu chí tìm kiếm của bạn."
					}
					actionLabel="Tạo bài thi mới"
					onAction={handleCreateTest}
					allowedRoles={PERMISSIONS.CREATE_TEST}
				/>
			);
		}

		return (
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
				{tests.map((test) => (
					<TestCard key={test.id} test={test} />
				))}
			</div>
		);
	};

	const tabs = [{ label: "Tất cả", value: "ALL" }];
	if (user) {
		if (user.role === Role.ADMIN || user.role === Role.CREATOR) {
			tabs.push({ label: "Của tôi", value: "MINE" });
		}
		tabs.push({ label: "Đã làm", value: "ATTEMPTED" });
	}

	return (
		<div className="p-6 max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
			<PageHeader
				title="Bài kiểm tra & Trắc nghiệm"
				description="Thử thách bản thân và ôn tập kiến thức hiệu quả."
				action={
					<PermissionGate allowedRoles={PERMISSIONS.CREATE_TEST}>
						<button
							onClick={handleCreateTest}
							disabled={isCreating}
							className="inline-flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm rounded-xl transition-colors shadow-sm hover:shadow disabled:opacity-70">
							{isCreating ? (
								<Loader2 className="w-4 h-4 animate-spin" />
							) : (
								<Plus className="w-4 h-4" />
							)}
							Tạo bài thi
						</button>
					</PermissionGate>
				}
			/>

			<FilterBar
				searchTerm={searchTerm}
				onSearchChange={setSearchTerm}
				searchPlaceholder="Tìm kiếm bài thi..."
				tabs={tabs}
				activeTab={scope}
				onTabChange={setScope}
				sortOptions={[
					{ label: "Mới nhất", value: "newest" },
					{ label: "Cũ nhất", value: "oldest" },
				]}
				activeSort={sort}
				onSortChange={setSort}
			/>

			{renderContent()}
		</div>
	);
}
