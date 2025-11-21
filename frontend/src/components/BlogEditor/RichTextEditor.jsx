import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import { useController } from "react-hook-form";
import EditorToolbar from "./EditorToolbar";

export default function RichTextEditor({ control }) {
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
			Image.configure({
				HTMLAttributes: {
					class: "rounded-xl shadow-sm border border-gray-100 my-6",
				},
			}),
			TextAlign.configure({
				types: ["heading", "paragraph"],
			}),
			Placeholder.configure({
				placeholder: "Start telling your story...",
				emptyEditorClass:
					"before:content-[attr(data-placeholder)] before:text-gray-300 before:float-left before:pointer-events-none h-full",
			}),
		],
		content: field.value, // Load initial content from form
		onUpdate: ({ editor }) => {
			// Sync Tiptap content back to RHF on every keystroke
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
			<EditorToolbar editor={editor} />

			<div className="w-full">
				<EditorContent editor={editor} />
			</div>
		</div>
	);
}
