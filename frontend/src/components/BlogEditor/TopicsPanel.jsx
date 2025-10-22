import TopicsInput from "../../components/TopicsInput";

export default function TopicsPanel({
  allTopics,
  selectedTopicIds,
  setSelectedTopicIds,
  onCreate,
  onDeleteTopic,
  onOpenCreate,
}) {
  return (
    <section className="bg-white p-4 rounded-lg shadow border border-blue-100 mb-8">
      <TopicsInput
        allTopics={allTopics}
        value={selectedTopicIds}
        onChange={setSelectedTopicIds}
        onCreate={onCreate}
        label="Chủ đề"
        placeholder="Nhập để tìm, Enter để thêm…"
      />
      <div className="mt-3 flex items-center gap-2">
        <button
          type="button"
          onClick={onOpenCreate} // ✅ dùng callback thay vì setOpenCreate(true)
          className="shrink-0 rounded bg-green-600 px-3 py-2 text-white hover:bg-green-700 text-sm shadow"
        >
          + New
        </button>
        <button
          type="button"
          onClick={onDeleteTopic}
          disabled={!selectedTopicIds.length}
          className="shrink-0 rounded bg-red-600 px-3 py-2 text-white hover:bg-red-700 disabled:opacity-50 text-sm shadow"
          title="Xóa Topic đang chọn"
        >
          Delete
        </button>
      </div>
    </section>
  );
}
