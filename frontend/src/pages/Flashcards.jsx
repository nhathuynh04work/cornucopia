import { getListsOfUser, getExploreLists } from "@/apis/listApi";
import CreateListButton from "@/components/Flashcards/CreateListButton";
import FlashcardsListsList from "@/components/Flashcards/FlashcardsListsList";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";

export function MyFlashcards() {
  const {user} = useAuth();
	const {
		data: lists,
		isPending,
		isError,
	} = useQuery({
		queryFn: getListsOfUser,
		queryKey: ["lists"],
    enabled: !!user 
	});

  if(!user) return <p className="text-center text-500">Vui lòng đăng nhập để có thể tạo danh sách</p>

	if (isError) {
		return (
			<p className="text-center text-red-500">Lỗi khi tải danh sách.</p>
		);
	}

  return (
		<FlashcardsListsList
			prependItem={<CreateListButton />}
			lists={lists}
			isPending={isPending}
			emptyMessage="Bạn chưa có danh sách nào."
			searchEmptyMessage="Không tìm thấy danh sách phù hợp."
		/>
	);
}

export function Explore() {
  const {
    data: lists,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["lists", "explore"],
    queryFn: getExploreLists,
  });

  if (isError) {
    return <p className="text-center text-red-500">Lỗi khi tải danh sách.</p>;
  }

  return (
    <FlashcardsListsList
      lists={lists}
      isPending={isPending}
      emptyMessage="Chưa có danh sách nào từ creator hoặc admin."
      searchEmptyMessage="Không tìm thấy danh sách phù hợp."
    />
  );
}
