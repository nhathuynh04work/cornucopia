// src/pages/BlogEditor.jsx
import { useCallback } from "react";
import { useNavigate, useParams } from "react-router";
import RichTextEditor from "../components/RichTextEditor";
import TopicCreateModal from "../components/TopicCreateModal";

import TopNav from "../components/BlogEditor/TopNav";
import CoverPicker from "../components/BlogEditor/CoverPicker";
import TopicsPanel from "../components/BlogEditor/TopicsPanel";

import { useBlogEditorState } from "../hooks/useBlogEditorState";
import { useAutoSave } from "../hooks/useAutoSave";
import { toPlainText } from "../lib/editor";

export default function BlogEditor() {
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    // state
    loading,
    isSaving,
    title,
    setTitle,
    contentHtml,
    setContentHtml,
    status,
    coverUrl,
    setCoverUrl,
    topics,
    selectedTopicIds,
    setSelectedTopicIds,
    openCreateTopic,
    setOpenCreateTopic,

    // derived
    titleError,

    // actions
    savePost,
    publish,
    saveDraftAndNavigate,
    createTopicInline,
    handleTopicCreated,
    handleDeleteTopic,
  } = useBlogEditorState({ id, navigate });

  // autosave khi form có nội dung hợp lệ
  const canAutoSave =
    !!id &&
    !loading &&
    !isSaving &&
    !!title.trim() &&
    !!toPlainText(contentHtml);
  useAutoSave({
    enabled: canAutoSave,
    deps: [title, contentHtml, status, coverUrl, selectedTopicIds],
    saveFn: useCallback(() => savePost(status, false), [savePost, status]),
  });

  const onPickCover = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => setCoverUrl(e.target.result);
    reader.readAsDataURL(file);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin text-4xl text-gray-400 mb-2">🌀</div>
        <p className="text-lg text-gray-500">Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <TopNav
        onBack={() => navigate("/blog")}
        isSaving={isSaving}
        status={status}
        onPublish={publish}
        onSaveDraft={saveDraftAndNavigate}
      />

      <div className="max-w-4xl mx-auto p-8">
        <CoverPicker
          coverUrl={coverUrl}
          onPick={onPickCover}
          onRemove={() => setCoverUrl("")}
        />

        <section className="mb-8">
          <input
            type="text"
            placeholder="Tiêu đề bài viết (tối thiểu 5 ký tự)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`w-full border border-blue-200 rounded p-3 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white shadow-sm ${
              titleError ? "border-red-400" : "mb-1"
            }`}
            maxLength={120}
          />
          {titleError && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              ⚠️ {titleError}
            </p>
          )}
        </section>

        <section className="mb-10">
          <RichTextEditor value={contentHtml} onChange={setContentHtml} />
        </section>

        <TopicsPanel
          allTopics={topics}
          selectedTopicIds={selectedTopicIds}
          setSelectedTopicIds={setSelectedTopicIds}
          onCreate={createTopicInline}
          onDeleteTopic={handleDeleteTopic}
          onOpenCreate={() => setOpenCreateTopic(true)}
        />

        <TopicCreateModal
          open={openCreateTopic}
          onClose={() => setOpenCreateTopic(false)}
          onCreated={handleTopicCreated}
        />
      </div>
    </div>
  );
}
