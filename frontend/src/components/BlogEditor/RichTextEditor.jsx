import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import CustomImage from "./CustomImageExtension";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import { useController } from "react-hook-form";
import EditorToolbar from "./EditorToolbar";

export default function RichTextEditor({ control, postId }) {
	const { field } = useController({
		name: "content",
		control,
	});

	const editor = useEditor({
		extensions: [
			StarterKit,
			Underline,
			Link.configure({
				openOnClick: false,
				HTMLAttributes: {
					class: "text-purple-600 hover:underline cursor-pointer",
				},
			}),
			CustomImage.configure({
				HTMLAttributes: {
					class: "rounded-xl shadow-sm border border-gray-100 my-6",
				},
			}),
			TextAlign.configure({
				types: ["heading", "paragraph"],
			}),
			Placeholder.configure({
				placeholder: "Start telling your story...",
			}),
		],
		content: field.value,
		onUpdate: ({ editor }) => {
			field.onChange(editor.getHTML());
		},
		editorProps: {
			attributes: {
				class: "prose prose-lg max-w-none focus:outline-none min-h-[500px] text-gray-700 font-serif leading-relaxed",
			},
		},
	});

	return (
		<div className="flex flex-col relative mb-12">
			<EditorToolbar editor={editor} postId={postId} />

			<div className="w-full">
				<EditorContent editor={editor} />
			</div>
		</div>
	);
}
