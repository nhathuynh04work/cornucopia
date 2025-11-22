import { useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { Link as LinkIcon } from "lucide-react";
import LinkEditorPanel from "./LinkEditorPanel";

export default function LinkButton({ editor }) {
	const [isOpen, setIsOpen] = useState(false);

	if (!editor) return null;

	const isActive = editor.isActive("link");

	const currentLink = editor.getAttributes("link").href || "";
	const currentSelection = editor.state.selection.empty
		? ""
		: editor.state.doc.textBetween(
				editor.state.selection.from,
				editor.state.selection.to
		  );

	const handleSave = (url, text) => {
		if (!url) {
			editor.chain().focus().extendMarkRange("link").unsetLink().run();
			setIsOpen(false);
			return;
		}

		if (text && editor.state.selection.empty) {
			editor
				.chain()
				.focus()
				.insertContent(`<a href="${url}">${text}</a>`)
				.run();
		} else {
			editor
				.chain()
				.focus()
				.extendMarkRange("link")
				.setLink({ href: url })
				.run();
		}

		setIsOpen(false);
	};

	return (
		<Popover.Root open={isOpen} onOpenChange={setIsOpen}>
			<Popover.Trigger asChild>
				<button
					type="button"
					title="Insert Link"
					className={`p-2 rounded-md hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors shrink-0 ${
						isActive ? "bg-gray-100 text-gray-900" : ""
					}`}>
					<LinkIcon className="w-5 h-5" />
				</button>
			</Popover.Trigger>

			<Popover.Portal>
				<Popover.Content
					className="z-50 animate-in fade-in zoom-in-95 duration-200"
					sideOffset={5}
					side="bottom"
					align="center">
					<LinkEditorPanel
						initialUrl={currentLink}
						initialText={currentSelection}
						onSave={handleSave}
						onCancel={() => setIsOpen(false)}
					/>
				</Popover.Content>
			</Popover.Portal>
		</Popover.Root>
	);
}
