export default function MediaRenderer({ media }) {
	const { url, fileType } = media;

	if (fileType.startsWith("image/")) {
		return (
			<img
				src={url}
				className="object-contain w-full h-full border rounded-md bg-gray-100"
			/>
		);
	}

	if (fileType.startsWith("video/")) {
		return (
			<video
				src={url}
				controls
				className="object-contain w-full h-full bg-black"
			/>
		);
	}

	if (fileType.startsWith("audio/")) {
		return (
			<div className="flex items-center justify-center w-full h-full p-2 bg-gray-100">
				<audio src={url} controls className="w-full" />
			</div>
		);
	}

	return (
		<div className="flex items-center justify-center w-full h-full bg-gray-100 text-gray-500 text-xs p-2">
			Unsupported type
		</div>
	);
}
