import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import DeckCard from "@/components/Decks/DeckCard";
import DeckFilterSidebar from "@/components/Decks/DeckFilterSidebar";
import PermissionGate from "@/components/Shared/PermissionGate";
import PaginationControl from "@/components/Shared/PaginationControl";
import ResourcePageLayout from "@/layouts/ResourcePageLayout";
import EmptyState from "@/components/Shared/EmptyState";
import { PERMISSIONS } from "@/lib/constants/common";
import { useGetDecks } from "@/hooks/useFlashcardQuery";
import { useResourceFilters } from "@/hooks/useResourceFilters";
import { useCreateDeck } from "@/hooks/useFlashcardMutation";
import toast from "react-hot-toast";
import SEO from "@/components/Shared/SEO";

const SORT_OPTIONS = [
	{ value: "newest", label: "Mới nhất" },
	{ value: "popularity", label: "Phổ biến nhất" },
	{ value: "alphabetical", label: "A-Z" },
	{ value: "oldest", label: "Cũ nhất" },
];

export default function Decks() {
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
		toggleFilterArray,
		clearFilters,
	} = useResourceFilters({ defaultSort: "newest", defaultLimit: 6 });

	const queryParams = useMemo(
		() => ({
			search: debouncedSearch,
			level: filters.level,
			language: filters.language,
			sort,
			page,
			limit,
		}),
		[debouncedSearch, filters, sort, page, limit]
	);

	const { data: deckResponse, isLoading } = useGetDecks(queryParams);

	const decks = deckResponse?.data || [];
	const pagination = deckResponse?.pagination || {
		totalItems: 0,
		totalPages: 1,
		currentPage: 1,
	};

	return (
		<>
			<ResourcePageLayout
				title="Thư viện Flashcard"
				description="Hàng triệu thẻ ghi nhớ giúp bạn học tập mọi lúc mọi nơi."
				action={
					<PermissionGate allowedRoles={PERMISSIONS.CREATE_DECK}>
						<CreateButton />
					</PermissionGate>
				}
				searchTerm={searchTerm}
				onSearchChange={(e) => setSearchTerm(e.target.value)}
				searchPlaceholder="Tìm kiếm bộ thẻ..."
				sort={sort}
				onSortChange={setSort}
				sortOptions={SORT_OPTIONS}
				totalItems={pagination.totalItems}
				itemLabel="bộ thẻ"
				filterContent={
					<DeckFilterSidebar
						filters={filters}
						toggleFilterArray={toggleFilterArray}
						clearFilters={clearFilters}
					/>
				}
				isLoading={isLoading}
				pagination={
					decks.length > 0 && (
						<PaginationControl
							currentPage={pagination.currentPage}
							totalPages={pagination.totalPages}
							onPageChange={setPage}
						/>
					)
				}>
				{decks.length > 0 ? (
					<div className="grid grid-cols-1 gap-4">
						{decks.map((deck) => (
							<div key={deck.id}>
								<DeckCard deck={deck} />
							</div>
						))}
					</div>
				) : (
					!isLoading && (
						<EmptyState
							icon={Search}
							title="Không tìm thấy kết quả"
							description="Không có bộ thẻ nào phù hợp với bộ lọc hiện tại.">
							<button
								onClick={clearFilters}
								className="text-purple-600 font-bold hover:underline">
								Xóa tất cả bộ lọc
							</button>
						</EmptyState>
					)
				)}
			</ResourcePageLayout>

			<SEO
				title={"Bộ thẻ | Cornucopia"}
				description="Danh sách các bộ thẻ"
			/>
		</>
	);
}

function CreateButton() {
	const navigate = useNavigate();
	const { mutate, isPending } = useCreateDeck();

	const handleCreate = () => {
		mutate(
			{},
			{
				onSuccess: (deck) => {
					toast.success("Tạo bộ thẻ thành công!");
					navigate(`/decks/${deck.id}/edit`);
				},
				onError: () => {
					toast.error("Tạo bộ thẻ thất bại.");
				},
			}
		);
	};
	return (
		<button
			onClick={handleCreate}
			disabled={isPending}
			className="inline-flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl transition-colors shadow-sm hover:shadow">
			<Plus className={`w-4 h-4 ${isPending ? "animate-spin" : ""}`} />
			{isPending ? "Đang tạo..." : "Tạo bộ thẻ"}
		</button>
	);
}
