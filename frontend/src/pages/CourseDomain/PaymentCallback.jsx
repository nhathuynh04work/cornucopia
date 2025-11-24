import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";

export default function PaymentCallback() {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	useEffect(() => {
		const status = searchParams.get("status");
		const courseId = searchParams.get("courseId");

		if (!status || !courseId) {
			console.error("Missing payment params");
			navigate("/dashboard");
			return;
		}

		if (status !== "success") {
			toast.error("Thanh toán thất bại.", { duration: 4000 });
			navigate(`/courses/${courseId}`, { replace: true });
			return;
		}

		toast.success("Thanh toán thành công! Đang chuyển hướng...");

		queryClient.invalidateQueries({
			queryKey: ["course", Number(courseId)],
		}),
			queryClient.invalidateQueries({ queryKey: ["courses"] }),
			navigate(`/courses/${courseId}`, { replace: true });
	}, [searchParams, navigate, queryClient]);

	return (
		<div className="h-screen flex flex-col items-center justify-center bg-white">
			<Loader2 className="w-12 h-12 animate-spin text-purple-600 mb-4" />
			<h2 className="text-xl font-semibold text-gray-900">
				Đang xử lý thanh toán...
			</h2>
			<p className="text-gray-500 mt-2">
				Vui lòng không tắt trình duyệt.
			</p>
		</div>
	);
}
