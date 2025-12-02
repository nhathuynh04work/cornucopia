import {
	Bold,
	Italic,
	Underline,
	Strikethrough,
	Heading2,
	Heading3,
	List,
	ListOrdered,
	Quote,
	Code,
	AlignLeft,
	AlignCenter,
	AlignRight,
	Undo,
	Redo,
} from "lucide-react";
import ImageUploadButton from "./ImageUploadButton";
import LinkButton from "./LinkButton";

export default function EditorToolbar({ editor, postId }) {
	if (!editor) return null;

	// Helper to check if a format is active
	const is = (name, attrs = {}) => editor.isActive(name, attrs);

	return (
		<div className="sticky top-[80px] z-40 mb-8 bg-white/80 backdrop-blur-md py-2 px-4 border border-gray-200 rounded-xl flex items-center gap-1 overflow-x-auto hide-scrollbar shadow-sm transition-all">
			{/* Text Style */}
			<div className="flex items-center gap-0.5 shrink-0">
				<ToolbarBtn
					icon={Bold}
					label="Bold"
					isActive={is("bold")}
					onClick={() => editor.chain().focus().toggleBold().run()}
				/>
				<ToolbarBtn
					icon={Italic}
					label="Italic"
					isActive={is("italic")}
					onClick={() => editor.chain().focus().toggleItalic().run()}
				/>
				<ToolbarBtn
					icon={Underline}
					label="Underline"
					isActive={is("underline")}
					onClick={() =>
						editor.chain().focus().toggleUnderline().run()
					}
				/>
				<ToolbarBtn
					icon={Strikethrough}
					label="Strike"
					isActive={is("strike")}
					onClick={() => editor.chain().focus().toggleStrike().run()}
				/>
			</div>
			<Divider />

			{/* Headings */}
			<div className="flex items-center gap-0.5 shrink-0">
				<ToolbarBtn
					icon={Heading2}
					label="H2"
					isActive={is("heading", { level: 2 })}
					onClick={() =>
						editor.chain().focus().toggleHeading({ level: 2 }).run()
					}
				/>
				<ToolbarBtn
					icon={Heading3}
					label="H3"
					isActive={is("heading", { level: 3 })}
					onClick={() =>
						editor.chain().focus().toggleHeading({ level: 3 }).run()
					}
				/>
			</div>
			<Divider />

			{/* Lists & Blocks */}
			<div className="flex items-center gap-0.5 shrink-0">
				<ToolbarBtn
					icon={List}
					label="Bullet List"
					isActive={is("bulletList")}
					onClick={() =>
						editor.chain().focus().toggleBulletList().run()
					}
				/>
				<ToolbarBtn
					icon={ListOrdered}
					label="Ordered List"
					isActive={is("orderedList")}
					onClick={() =>
						editor.chain().focus().toggleOrderedList().run()
					}
				/>
				<ToolbarBtn
					icon={Quote}
					label="Quote"
					isActive={is("blockquote")}
					onClick={() =>
						editor.chain().focus().toggleBlockquote().run()
					}
				/>
				<ToolbarBtn
					icon={Code}
					label="Code"
					isActive={is("codeBlock")}
					onClick={() =>
						editor.chain().focus().toggleCodeBlock().run()
					}
				/>
			</div>
			<Divider />

			{/* Inserts */}
			<div className="flex items-center gap-0.5 shrink-0">
				<LinkButton editor={editor} />
				<ImageUploadButton editor={editor} postId={postId} />
			</div>
			<Divider />

			{/* Alignment */}
			<div className="flex items-center gap-0.5 shrink-0">
				<ToolbarBtn
					icon={AlignLeft}
					label="Left"
					isActive={is({ textAlign: "left" })}
					onClick={() =>
						editor.chain().focus().setTextAlign("left").run()
					}
				/>
				<ToolbarBtn
					icon={AlignCenter}
					label="Center"
					isActive={is({ textAlign: "center" })}
					onClick={() =>
						editor.chain().focus().setTextAlign("center").run()
					}
				/>
				<ToolbarBtn
					icon={AlignRight}
					label="Right"
					isActive={is({ textAlign: "right" })}
					onClick={() =>
						editor.chain().focus().setTextAlign("right").run()
					}
				/>
			</div>
			<Divider />

			{/* History */}
			<div className="flex items-center gap-0.5 shrink-0">
				<ToolbarBtn
					icon={Undo}
					label="Undo"
					onClick={() => editor.chain().focus().undo().run()}
				/>
				<ToolbarBtn
					icon={Redo}
					label="Redo"
					onClick={() => editor.chain().focus().redo().run()}
				/>
			</div>
		</div>
	);
}

function Divider() {
	return <div className="w-px h-5 bg-gray-200 mx-2 shrink-0" />;
}

// eslint-disable-next-line no-unused-vars
function ToolbarBtn({ icon: Icon, label, isActive, onClick }) {
	return (
		<button
			type="button"
			onClick={onClick}
			title={label}
			className={`p-2 rounded-md hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors shrink-0 ${
				isActive ? "bg-gray-100 text-gray-900" : ""
			}`}>
			<Icon className="w-5 h-5" />
		</button>
	);
}
