import { useNavigate } from "react-router-dom";
import { Plus, Layers, AlertCircle, Loader2 } from "lucide-react";
import { useCreateDeck } from "@/hooks/useFlashcardMutation";
import PermissionGate from "@/components/PermissionGate";
import { PERMISSIONS } from "@/lib/constants";
import toast from "react-hot-toast";
import DeckList from "@/components/Decks/DeckList";
import PageHeader from "@/components/Shared/PageHeader";
import FilterBar from "@/components/Shared/FilterBar";
import EmptyState from "@/components/Shared/EmptyState";
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

	const renderContent = () => {
		if (isPending) {
			return (
				<div className="h-96 flex flex-col items-center justify-center text-gray-400">
					<Loader2 className="w-10 h-10 animate-spin mb-3 text-purple-500" />
					<p>Đang tải flashcards...</p>
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

		if (!decks || decks.length === 0) {
			return (
				<EmptyState
					icon={Layers}
					title="Không tìm thấy bộ thẻ"
					description="Hãy tạo bộ thẻ flashcard riêng của bạn để bắt đầu học tập hiệu quả."
					actionLabel="Tạo bộ thẻ"
					onAction={handleCreateDeck}
					allowedRoles={PERMISSIONS.CREATE_FLASHCARD}
				/>
			);
		}

		return <DeckList decks={decks} />;
	};

	const tabs = [{ label: "Tất cả", value: "ALL" }];
	if (user) {
		tabs.push({ label: "Của tôi", value: "MINE" });
	}

	return (
		<div className="p-6 max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
			<PageHeader
				title="Thư viện Flashcards"
				description="Cải thiện trí nhớ với phương pháp lặp lại ngắt quãng."
				action={
					<PermissionGate allowedRoles={PERMISSIONS.CREATE_FLASHCARD}>
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

			{renderContent()}
		</div>
	);
}
