import { getListsOfUser } from "@/apis/listApi";
import CreateListButton from "@/components/Flashcards/CreateListButton";
import FlashcardsListsList from "@/components/Flashcards/FlashcardsListsList";
import { useQuery } from "@tanstack/react-query";

export function MyFlashcards() {
	const {
		data: lists,
		isPending,
		isError,
	} = useQuery({
		queryFn: getListsOfUser,
		queryKey: ["lists"],
	});

	if (isError) {
		return (
			<p className="text-center text-red-500">Lỗi khi tải danh sách.</p>
		);
	}

	return (
		<FlashcardsListsList
			prependItem={<CreateListButton />}
			lists={lists || []}
			isPending={isPending}
			emptyMessage="Bạn chưa có danh sách nào."
			searchEmptyMessage="Không tìm thấy danh sách phù hợp."
		/>
	);
}

export function Explore() {
	return <div>Explore</div>;
}
