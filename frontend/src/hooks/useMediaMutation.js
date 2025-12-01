import mediaApi from "@/apis/mediaApi";
import { useMutation } from "@tanstack/react-query";

export const useUploadMedia = () => {
	return useMutation({
		mutationFn: mediaApi.upload,
	});
};
