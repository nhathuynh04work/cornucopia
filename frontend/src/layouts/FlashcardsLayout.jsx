import TabsSearchbarLayout from "./TabSearchbarLayout";

const TABS = {
  MY_FLASHCARDS: {
    title: "Flashcards của tôi",
    key: "my",
    path: "/flashcards/my",
  },
  EXPLORE: { title: "Khám phá", key: "explore", path: "/flashcards/explore" },
};

function FlashcardsLayout() {
  return (
    <TabsSearchbarLayout
      tabs={Object.values(TABS)}
      searchPlaceholder="Tìm kiếm danh sách..."
    />
  );
}

export default FlashcardsLayout;
