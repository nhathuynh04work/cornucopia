import { Play, Edit3, ShoppingCart, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Role } from "@/lib/constants";
import StatusBadge from "@/components/StatusBadge";
import { useAuth } from "@/contexts/AuthContext";
import { useCreateCheckoutSession } from "@/hooks/useCourseMutation";
import { Loader2 } from "lucide-react";

export default function CourseHero({ course, isEnrolled }) {
	const navigate = useNavigate();
	const { user, role } = useAuth();

	const { mutate: createCheckout, isPending: isCheckoutPending } =
		useCreateCheckoutSession(course.id);

	const isOwner = user?.id === course.userId;
	const canEdit = role === Role.ADMIN || isOwner;
	const canLearn = isEnrolled;
	const canBuy = !isEnrolled;

	const handleBuy = () => {
		if (!user) {
			navigate("/login");
			return;
		}
		createCheckout();
	};

	const formattedPrice =
		course.price === 0
			? "Miễn phí"
			: new Intl.NumberFormat("vi-VN", {
					style: "currency",
					currency: "VND",
			  }).format(course.price);

	return (
		<div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group">
			{/* Decorative Blob */}
			<div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-purple-50 rounded-full blur-3xl opacity-50 group-hover:bg-purple-100 transition-colors duration-700 pointer-events-none"></div>

			<div className="relative z-10">
				<div className="flex items-start justify-between gap-4 mb-6">
					<StatusBadge status={course.status} />
					{canEdit && (
						<button
							onClick={() =>
								navigate(`/courses/${course.id}/edit`)
							}
							className="p-2 bg-gray-50 hover:bg-gray-100 text-gray-500 hover:text-purple-600 rounded-xl transition-colors"
							title="Chỉnh sửa khóa học">
							<Edit3 className="w-5 h-5" />
						</button>
					)}
				</div>

				<div className="flex flex-col md:flex-row gap-8">
					{course.coverUrl && (
						<div className="w-full md:w-1/3 aspect-video rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
							<img
								src={course.coverUrl}
								alt={course.name}
								className="w-full h-full object-cover"
							/>
						</div>
					)}

					<div className="flex-1">
						<h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
							{course.name}
						</h1>

						<p className="text-gray-500 text-lg leading-relaxed mb-8 line-clamp-3">
							{course.description ||
								"Chưa có mô tả cho khóa học này. Hãy tham gia để khám phá nội dung!"}
						</p>

						<div className="flex flex-wrap gap-4 items-center">
							{canLearn ? (
								<button
									onClick={() =>
										navigate(`/courses/${course.id}/learn`)
									}
									className="flex-1 sm:flex-none inline-flex items-center justify-center gap-3 px-8 py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-2xl shadow-lg shadow-purple-200 transition-all hover:-translate-y-1">
									<Play className="w-5 h-5 fill-current" />
									Vào học ngay
								</button>
							) : canBuy ? (
								<button
									onClick={handleBuy}
									disabled={isCheckoutPending}
									className="flex-1 sm:flex-none inline-flex items-center justify-center gap-3 px-8 py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-2xl shadow-lg shadow-purple-200 transition-all hover:-translate-y-1 disabled:opacity-70 disabled:transform-none">
									{isCheckoutPending ? (
										<Loader2 className="w-5 h-5 animate-spin" />
									) : (
										<ShoppingCart className="w-5 h-5" />
									)}
									Mua khóa học - {formattedPrice}
								</button>
							) : null}

							{isEnrolled && !isOwner && (
								<span className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-xl font-medium text-sm border border-green-100">
									<Check className="w-4 h-4" /> Đã tham gia
								</span>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
