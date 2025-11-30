import Image from "@tiptap/extension-image";
import { ReactNodeViewRenderer } from "@tiptap/react";
import ImageNodeView from "./ImageNodeView";

export default Image.extend({
	// Add 'id' to the allowed attributes
	addAttributes() {
		return {
			...this.parent?.(),
			id: {
				default: null,
			},
			src: {
				default: null,
			},
			alt: {
				default: null,
			},
		};
	},

	// Tell Tiptap to render our React component
	addNodeView() {
		return ReactNodeViewRenderer(ImageNodeView);
	},
});
