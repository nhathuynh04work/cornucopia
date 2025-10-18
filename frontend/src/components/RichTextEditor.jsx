import { useEffect, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";

// --- IMPORTS ICON ---
import {
  FaBold,
  FaItalic,
  FaStrikethrough,
  FaListUl,
  FaListOl,
  FaQuoteLeft,
  FaCode,
  FaLink,
  FaImage,
  FaTrash,
  FaAlignCenter,
  FaAlignLeft,
  FaAlignRight,
  FaUndo,
  FaRedo,
  FaUnderline,
} from "react-icons/fa";
// Import không cần thiết cho toolbar này (IoArrowDown/Up)
// import { IoArrowDownCircleOutline, IoArrowUpCircleOutline } from "react-icons/io5";

// Component nút Toolbar dùng chung (Đã khôi phục)
const ToolbarButton = ({
  editor,
  command,
  isActive,
  icon,
  title,
  options = {},
}) => {
  if (!editor) return null;

  const runCommand = () => {
    // --- Xử lý Link ---
    if (command === "setLink") {
      const previousUrl = editor.getAttributes("link").href;
      const url = window.prompt("URL", previousUrl);

      if (url === null) return;
      if (url === "") {
        editor.chain().focus().unsetLink().run();
        return;
      }

      editor.chain().focus().setLink({ href: url, target: "_blank" }).run();
      return;
    }

    // --- Xử lý các lệnh thông thường ---
    editor.chain().focus()[command](options).run();
  };

  // Kiểm tra trạng thái active/disabled
  const active = editor.isActive(isActive, options);
  const disabled =
    (command === "undo" && !editor.can().undo()) ||
    (command === "redo" && !editor.can().redo());

  return (
    <button
      onClick={runCommand}
      disabled={disabled}
      className={`p-2 rounded transition-colors duration-100 ${
        active ? "bg-gray-800 text-white" : "text-gray-600 hover:bg-gray-200"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      title={title}
      type="button"
    >
      {icon}
    </button>
  );
};

// Component chính
export default function RichTextEditor({ value, onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Placeholder.configure({
        placeholder: "Viết nội dung bài viết…",
        emptyNodeClass: "is-editor-empty",
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 underline hover:text-blue-800",
        },
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Underline,
    ],
    content: value || "",
    onUpdate({ editor }) {
      onChange?.(editor.getHTML());
    },
  });

  // TÍNH NĂNG UPLOAD ẢNH (Base64) - Đã khôi phục
  const addImage = useCallback(() => {
    if (!editor) return;

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.style.display = "none";
    document.body.appendChild(fileInput);

    fileInput.onchange = (e) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (readerEvent) => {
          const base64Image = readerEvent.target.result;
          editor.chain().focus().setImage({ src: base64Image }).run();
        };
        reader.readAsDataURL(file);
      }
      document.body.removeChild(fileInput);
    };

    fileInput.click();
  }, [editor]);

  // Đồng bộ khi value ngoài (contentHtml) thay đổi
  useEffect(() => {
    if (editor && typeof value === "string" && value !== editor.getHTML()) {
      editor.commands.setContent(value, false);
    }
  }, [value, editor]);

  if (!editor) return null;

  return (
    <div
      className="border border-gray-300 rounded-lg shadow-sm w-full"
      style={{ minWidth: 700 }}
    >
      {/* Fixed Toolbar */}
      {/* Bỏ lớp `sticky top-0 z-10` nếu bạn không muốn nó dính khi cuộn */}
      <div className="p-2 border-b border-gray-200 flex-nowrap flex gap-2 bg-gray-50 rounded-t-lg sticky top-0 z-10 overflow-x-auto">
        {/* Nhóm 1: Định dạng cơ bản */}
        <div className="flex gap-1">
          <ToolbarButton
            editor={editor}
            command="toggleBold"
            isActive="bold"
            title="Bold (Ctrl+B)"
            icon={<FaBold size={16} />}
          />
          <ToolbarButton
            editor={editor}
            command="toggleItalic"
            isActive="italic"
            title="Italic (Ctrl+I)"
            icon={<FaItalic size={16} />}
          />
          <ToolbarButton
            editor={editor}
            command="toggleUnderline"
            isActive="underline"
            title="Underline (Ctrl+U)"
            icon={<FaUnderline size={16} />}
          />
          <ToolbarButton
            editor={editor}
            command="toggleStrike"
            isActive="strike"
            title="Strike (Ctrl+Shift+X)"
            icon={<FaStrikethrough size={16} />}
          />
        </div>
        <span className="border-l border-gray-300 mx-2"></span>
        {/* Nhóm 2: Heading */}
        <div className="flex gap-1">
          <ToolbarButton
            editor={editor}
            command="toggleHeading"
            isActive="heading"
            title="Heading 2"
            options={{ level: 2 }}
            icon={<span className="font-bold">H2</span>}
          />
          <ToolbarButton
            editor={editor}
            command="toggleHeading"
            isActive="heading"
            title="Heading 3"
            options={{ level: 3 }}
            icon={<span className="font-bold">H3</span>}
          />
        </div>
        <span className="border-l border-gray-300 mx-2"></span>
        {/* Nhóm 3: Danh sách, blockquote, code */}
        <div className="flex gap-1">
          <ToolbarButton
            editor={editor}
            command="toggleBulletList"
            isActive="bulletList"
            title="Bullet List"
            icon={<FaListUl size={16} />}
          />
          <ToolbarButton
            editor={editor}
            command="toggleOrderedList"
            isActive="orderedList"
            title="Numbered List"
            icon={<FaListOl size={16} />}
          />
          <ToolbarButton
            editor={editor}
            command="toggleBlockquote"
            isActive="blockquote"
            title="Blockquote"
            icon={<FaQuoteLeft size={16} />}
          />
          <ToolbarButton
            editor={editor}
            command="toggleCodeBlock"
            isActive="codeBlock"
            title="Code Block"
            icon={<FaCode size={16} />}
          />
        </div>
        <span className="border-l border-gray-300 mx-2"></span>
        {/* Nhóm 4: Link, ảnh */}
        <div className="flex gap-1">
          <ToolbarButton
            editor={editor}
            command="setLink"
            isActive="link"
            title="Link (Ctrl+K)"
            icon={<FaLink size={16} />}
          />
          <button
            onClick={addImage}
            className="p-2 rounded text-gray-600 hover:bg-gray-200"
            title="Thêm ảnh từ File"
            type="button"
          >
            <FaImage size={16} />
          </button>
        </div>
        <span className="border-l border-gray-300 mx-2"></span>
        {/* Nhóm 5: Căn lề */}
        <div className="flex gap-1">
          <ToolbarButton
            editor={editor}
            command="setTextAlign"
            isActive={{ textAlign: "left" }}
            title="Align Left"
            options={"left"}
            icon={<FaAlignLeft size={16} />}
          />
          <ToolbarButton
            editor={editor}
            command="setTextAlign"
            isActive={{ textAlign: "center" }}
            title="Align Center"
            options={"center"}
            icon={<FaAlignCenter size={16} />}
          />
          <ToolbarButton
            editor={editor}
            command="setTextAlign"
            isActive={{ textAlign: "right" }}
            title="Align Right"
            options={"right"}
            icon={<FaAlignRight size={16} />}
          />
        </div>
        <span className="border-l border-gray-300 mx-2"></span>
        {/* Nhóm 6: Undo/Redo */}
        <div className="flex gap-1">
          <ToolbarButton
            editor={editor}
            command="undo"
            isActive="undo"
            title="Undo (Ctrl+Z)"
            icon={<FaUndo size={16} />}
          />
          <ToolbarButton
            editor={editor}
            command="redo"
            isActive="redo"
            title="Redo (Ctrl+Y)"
            icon={<FaRedo size={16} />}
          />
        </div>
      </div>

      {/* Editor Content */}
      <EditorContent
        editor={editor}
        className="p-4 min-h-[400px] prose max-w-none tiptap"
      />
    </div>
  );
}
