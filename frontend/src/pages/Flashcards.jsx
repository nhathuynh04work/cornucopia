import { getListsOfUser, getExploreLists } from "@/apis/listApi";
import CreateCard from "@/components/Flashcards/CreateCard";
import List from "@/components/Flashcards/List";
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
    return <p className="text-center text-red-500">Lỗi khi tải danh sách.</p>;
  }

  return (
    <List
      prependItem={<CreateCard />}
      lists={lists || []}
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
    <List
      lists={lists || []}
      isPending={isPending}
      emptyMessage="Chưa có danh sách nào từ creator hoặc admin."
      searchEmptyMessage="Không tìm thấy danh sách phù hợp."
    />
  );
}
