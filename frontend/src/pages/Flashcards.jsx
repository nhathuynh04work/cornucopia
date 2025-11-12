import { getListsOfUser } from "@/apis/listApi";
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
    prependItem={<CreateCard/>}
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
