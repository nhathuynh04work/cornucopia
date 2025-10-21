import { Loader2, AlertTriangle } from "lucide-react";
import { useSignedViewUrlQuery } from "@/hooks/useSignedViewUrlQuery";

export default function MediaRenderer({ media }) {
	const { s3Key, fileType } = media;

	const { data: fetchUrl, isLoading, isError } = useSignedViewUrlQuery(s3Key);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center w-full h-full bg-gray-100">
				<Loader2 className="w-6 h-6 animate-spin text-gray-400" />
			</div>
		);
	}

	if (isError || !fetchUrl) {
		return (
			<div className="flex flex-col items-center justify-center w-full h-full bg-red-50 text-red-500">
				<AlertTriangle className="w-6 h-6" />
				<span className="text-xs mt-1">Load failed</span>
			</div>
		);
	}

	if (fileType.startsWith("image/")) {
		return (
			<img
				src={fetchUrl}
				alt={s3Key}
				className="object-contain w-full h-full border rounded-md bg-gray-100"
			/>
		);
	}

	if (fileType.startsWith("video/")) {
		return (
			<video
				src={fetchUrl}
				controls
				className="object-contain w-full h-full bg-black"
			/>
		);
	}

	if (fileType.startsWith("audio/")) {
		return (
			<div className="flex items-center justify-center w-full h-full p-2 bg-gray-100">
				<audio src={fetchUrl} controls className="w-full" />
			</div>
		);
	}

	return (
		<div className="flex items-center justify-center w-full h-full bg-gray-100 text-gray-500 text-xs p-2">
			Unsupported type
		</div>
	);
}
