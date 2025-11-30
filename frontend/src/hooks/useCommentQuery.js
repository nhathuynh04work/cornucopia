import { useQuery } from "@tanstack/react-query";
import commentApi from "@/apis/commentApi";

export function useGetComments({ postId, lessonId, testId }) {
  const params = { postId, lessonId, testId };

  // Lọc bỏ các giá trị undefined để URL sạch đẹp
  Object.keys(params).forEach(
    (key) => params[key] === undefined && delete params[key]
  );

  return useQuery({
    queryKey: ["comments", params],
    queryFn: async () => {
      // Gọi qua commentApi
      const response = await commentApi.getCommentsByEntity(params);
      // Backend trả về: { status: "success", data: { comments: [], metadata: {} } }
      // Axios trả về response.data là toàn bộ cục trên.
      // Ta cần lấy phần data bên trong.
      return response.data.data;
    },
    enabled: !!(postId || lessonId || testId), // Chỉ chạy khi có ID
  });
}
