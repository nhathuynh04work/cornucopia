import { useNavigate } from "react-router-dom";
import { Plus, Layers, Loader2 } from "lucide-react";
import { useCreateDeck } from "@/hooks/useFlashcardMutation";
import PermissionGate from "@/components/Shared/PermissionGate";
import { PERMISSIONS } from "@/lib/constants";
import toast from "react-hot-toast";
import DeckCard from "@/components/Decks/DeckCard";
import PageHeader from "@/components/Shared/PageHeader";
import FilterBar from "@/components/Shared/FilterBar";
import ResourceList from "@/components/Shared/ResourceList";
import { useAuth } from "@/contexts/AuthContext";
import { useResourceFilters } from "@/hooks/useResourceFilters";
import { useGetDecks } from "@/hooks/useFlashcardQuery";

export default function Decks() {
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

	const { mutate: createDeck, isPending: isCreating } = useCreateDeck();

	const queryParams = {
		search: debouncedSearch,
		sort,
	};

	if (scope === "MINE" && user) {
		queryParams.userId = user.id;
	}

	const { data: decks, isPending, isError } = useGetDecks(queryParams);

	const handleCreateDeck = () => {
		createDeck(
			{},
			{
				onSuccess: (newDeck) => {
					navigate(`/decks/${newDeck.id}/edit`);
					toast.success("Tạo bộ thẻ thành công!");
				},
				onError: () => toast.error("Không thể tạo bộ thẻ."),
			}
		);
	};

	const tabs = [{ label: "Tất cả", value: "ALL" }];
	if (user) {
		tabs.push({ label: "Của tôi", value: "MINE" });
	}

	return (
		<div className="max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
			<div className="px-6 pt-6">
				<PageHeader
					title="Thư viện Flashcards"
					description="Cải thiện trí nhớ với phương pháp lặp lại ngắt quãng."
					action={
						<PermissionGate
							allowedRoles={PERMISSIONS.CREATE_FLASHCARD}>
							<button
								onClick={handleCreateDeck}
								disabled={isCreating}
								className="inline-flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm rounded-xl transition-colors shadow-sm hover:shadow disabled:opacity-70">
								{isCreating ? (
									<Loader2 className="w-4 h-4 animate-spin" />
								) : (
									<Plus className="w-4 h-4" />
								)}
								Tạo bộ thẻ
							</button>
						</PermissionGate>
					}
				/>
			</div>

			<div className="sticky top-0 z-20 bg-gray-50/95 backdrop-blur-md px-6 py-4 transition-all duration-200">
				<FilterBar
					searchTerm={searchTerm}
					onSearchChange={setSearchTerm}
					searchPlaceholder="Tìm kiếm bộ thẻ..."
					tabs={tabs}
					activeTab={scope}
					onTabChange={setScope}
					sortOptions={[
						{ label: "Mới nhất", value: "newest" },
						{ label: "Cũ nhất", value: "oldest" },
						{ label: "A-Z", value: "alphabetical" },
					]}
					activeSort={sort}
					onSortChange={setSort}
				/>
			</div>

			<div className="px-6 pb-6">
				<ResourceList
					isLoading={isPending}
					isError={isError}
					data={decks}
					resourceName="bộ thẻ"
					gridCols="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
					renderItem={(deck) => (
						<DeckCard key={deck.id} deck={deck} />
					)}
					emptyState={{
						icon: Layers,
						title: "Không tìm thấy bộ thẻ",
						description:
							"Hãy tạo bộ thẻ flashcard riêng của bạn để bắt đầu học tập hiệu quả.",
						actionLabel: "Tạo bộ thẻ",
						onAction: handleCreateDeck,
						allowedRoles: PERMISSIONS.CREATE_FLASHCARD,
					}}
				/>
			</div>
		</div>
	);
}
