import CreateDeckButton from "@/components/Decks/CreateDeckButton";
import DeckList from "@/components/Decks/DeckList";
import { useAuth } from "@/contexts/AuthContext";
import { useGetExploreDecks, useGetMyDecks } from "@/hooks/useFlashcardQuery";

export function MyDecks() {
	const { user } = useAuth();
	const { data: decks, isPending, isError } = useGetMyDecks();

	if (!user)
		return (
			<p className="text-center text-500">
				Vui lòng đăng nhập để có thể tạo bộ thẻÏ
			</p>
		);

	if (isError) {
		return <p className="text-center text-red-500">Lỗi khi tải bộ thẻ.</p>;
	}

	return (
		<DeckList
			prependItem={<CreateDeckButton />}
			decks={decks}
			isPending={isPending}
			emptyMessage="Bạn chưa có bộ thẻ nào."
			searchEmptyMessage="Không tìm thấy bộ thẻ phù hợp."
		/>
	);
}

export function Explore() {
	const { data: decks, isPending, isError } = useGetExploreDecks();

	if (isError) {
		return <p className="text-center text-red-500">Lỗi khi tải bộ thẻ.</p>;
	}

	return (
		<DeckList
			decks={decks}
			isPending={isPending}
			emptyMessage="Chưa có bộ thẻ nào từ creator hoặc admin."
			searchEmptyMessage="Không tìm thấy bộ thẻ phù hợp."
		/>
	);
}
