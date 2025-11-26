import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
	Bold,
	Italic,
	List,
	ListOrdered,
	Heading1,
	Heading2,
	Quote,
} from "lucide-react";
import clsx from "clsx";
import { useEffect } from "react";

const ToolbarButton = ({ onClick, isActive, icon: Icon }) => (
	<button
		type="button"
		onClick={onClick}
		className={clsx(
			"p-1.5 rounded-md transition-colors",
			isActive
				? "bg-purple-100 text-purple-700"
				: "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
		)}>
		<Icon className="w-4 h-4" />
	</button>
);

export default function SimpleRichTextEditor({
	value,
	onChange,
	placeholder,
	className,
}) {
	const editor = useEditor({
		extensions: [
			StarterKit.configure({
				heading: {
					levels: [1, 2],
				},
				blockquote: true,
			}),
		],
		content: value || "",
		editorProps: {
			attributes: {
				class: clsx(
					"prose prose-sm focus:outline-none px-4 py-3 text-gray-700 max-w-none",
					"prose-headings:mb-2 prose-headings:mt-2 prose-p:my-1 prose-p:leading-normal",
					"prose-blockquote:border-l-4 prose-blockquote:border-purple-200 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-500",
					className || "min-h-[80px]"
				),
			},
		},
		onUpdate: ({ editor }) => {
			const html = editor.isEmpty ? "" : editor.getHTML();
			onChange(html);
		},
	});

	useEffect(() => {
		if (editor && value !== editor.getHTML()) {
			editor.commands.setContent(value || "");
		}
	}, [value, editor]);

	if (!editor) {
		return null;
	}

	return (
		<div className="border border-gray-200 rounded-xl bg-white overflow-hidden focus-within:ring-2 focus-within:ring-purple-100 focus-within:border-purple-500 transition-all group/editor">
			{/* Toolbar */}
			<div className="flex items-center gap-1 border-b border-gray-100 px-2 py-1.5 bg-gray-50/50 flex-wrap">
				<ToolbarButton
					onClick={() =>
						editor.chain().focus().toggleHeading({ level: 1 }).run()
					}
					isActive={editor.isActive("heading", { level: 1 })}
					icon={Heading1}
				/>
				<ToolbarButton
					onClick={() =>
						editor.chain().focus().toggleHeading({ level: 2 }).run()
					}
					isActive={editor.isActive("heading", { level: 2 })}
					icon={Heading2}
				/>

				<div className="w-px h-4 bg-gray-200 mx-1" />

				<ToolbarButton
					onClick={() => editor.chain().focus().toggleBold().run()}
					isActive={editor.isActive("bold")}
					icon={Bold}
				/>
				<ToolbarButton
					onClick={() => editor.chain().focus().toggleItalic().run()}
					isActive={editor.isActive("italic")}
					icon={Italic}
				/>

				<ToolbarButton
					onClick={() =>
						editor.chain().focus().toggleBlockquote().run()
					}
					isActive={editor.isActive("blockquote")}
					icon={Quote}
				/>

				<div className="w-px h-4 bg-gray-200 mx-1" />

				<ToolbarButton
					onClick={() =>
						editor.chain().focus().toggleBulletList().run()
					}
					isActive={editor.isActive("bulletList")}
					icon={List}
				/>
				<ToolbarButton
					onClick={() =>
						editor.chain().focus().toggleOrderedList().run()
					}
					isActive={editor.isActive("orderedList")}
					icon={ListOrdered}
				/>
			</div>

			{/* Editor Area */}
			<EditorContent editor={editor} placeholder={placeholder} />
		</div>
	);
}
