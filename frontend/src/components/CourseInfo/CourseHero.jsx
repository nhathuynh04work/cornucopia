import {
	Play,
	Edit3,
	ShoppingCart,
	Check,
	Loader2,
	Globe,
	BarChart,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Role } from "@/lib/constants";
import StatusBadge from "@/components/Shared/StatusBadge";
import { useAuth } from "@/contexts/AuthContext";
import { useCreateCheckoutSession } from "@/hooks/useCourseMutation";
import { LEVEL_OPTIONS, LANGUAGE_OPTIONS } from "@/lib/constants/course";
import Avatar from "@/components/Shared/Avatar";

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

	const getLabel = (options, value) =>
		options.find((o) => o.value === value)?.label || value;

	const levelLabel = getLabel(LEVEL_OPTIONS, course.level);
	const langLabel = getLabel(LANGUAGE_OPTIONS, course.language);

	return (
		<div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group">
			<div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-purple-50 rounded-full blur-3xl opacity-50 group-hover:bg-purple-100 transition-colors duration-700 pointer-events-none"></div>

			<div className="relative z-10">
				<div className="flex items-start justify-between gap-4 mb-4">
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

				<div className="flex flex-col md:flex-row-reverse gap-6 md:gap-8 items-start">
					{course.coverUrl && (
						<div className="w-full md:w-5/12 aspect-video rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-gray-50 shrink-0">
							<img
								src={course.coverUrl}
								alt={course.title}
								className="w-full h-full object-cover"
							/>
						</div>
					)}

					<div className="flex-1 min-w-0 space-y-4">
						{/* UPDATED: Reduced Title Size */}
						<h1 className="text-xl md:text-2xl font-bold text-gray-900 leading-snug">
							{course.title}
						</h1>

						{course.excerpt && (
							<p className="text-base text-gray-500 font-medium leading-relaxed line-clamp-3">
								{course.excerpt}
							</p>
						)}

						<div className="flex flex-wrap items-center gap-2 py-1">
							<div className="flex items-center gap-1.5 bg-blue-50 px-2.5 py-1 rounded-full text-blue-700 text-xs font-bold border !border-blue-100">
								<BarChart className="w-3 h-3" />
								{levelLabel}
							</div>

							<div className="flex items-center gap-1.5 bg-indigo-50 px-2.5 py-1 rounded-full text-indigo-700 text-xs font-bold border !border-indigo-100">
								<Globe className="w-3 h-3" />
								{langLabel}
							</div>
						</div>

						<div className="flex flex-wrap gap-3 items-center pt-2 mt-auto">
							{canLearn ? (
								<button
									onClick={() =>
										navigate(`/courses/${course.id}/learn`)
									}
									className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-lg shadow-purple-200 transition-all hover:-translate-y-0.5 text-sm">
									<Play className="w-4 h-4 fill-current" />
									Vào học ngay
								</button>
							) : canBuy ? (
								<button
									onClick={handleBuy}
									disabled={isCheckoutPending}
									className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-lg shadow-purple-200 transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:transform-none text-sm">
									{isCheckoutPending ? (
										<Loader2 className="w-4 h-4 animate-spin" />
									) : (
										<ShoppingCart className="w-4 h-4" />
									)}
									Mua ngay - {formattedPrice}
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
