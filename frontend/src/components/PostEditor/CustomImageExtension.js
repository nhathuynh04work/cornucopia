import Image from "@tiptap/extension-image";
import { ReactNodeViewRenderer } from "@tiptap/react";
import ImageNodeView from "./ImageNodeView";

export default Image.extend({
	addAttributes() {
		return {
			...this.parent?.(),
			src: {
				default: null,
			},
			alt: {
				default: null,
			},
		};
	},

	addNodeView() {
		return ReactNodeViewRenderer(ImageNodeView);
	},
});
