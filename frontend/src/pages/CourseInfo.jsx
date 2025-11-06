import { useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Edit, Video, FileText, BookOpen, Layers, Loader2 } from "lucide-react";
import NavButton from "@/components/NavButton";
import { usePublicCourseQuery } from "@/hooks/useCourseQuery";
import { useMutation } from "@tanstack/react-query";
import * as courseApi from "@/apis/courseApi";
import { toast } from "react-hot-toast";

const lessonIcon = {
	VIDEO: <Video className="w-4 h-4 text-purple-600" />,
	TEXT: <FileText className="w-4 h-4 text-blue-600" />,
};

function CourseInfo() {
	const { id } = useParams();
	const [searchParams, setSearchParams] = useSearchParams();

	const { data: course, isPending } = usePublicCourseQuery(id);

	const { mutate: createCheckout, isPending: isCheckoutPending } =
		useMutation({
			mutationFn: () => courseApi.createCheckoutSession(id),
			onSuccess: (url) => {
				window.location.href = url;
			},
			onError: (err) => {
				toast.error(err.message || "Failed to start checkout.");
			},
		});

	useEffect(() => {
		const paymentStatus = searchParams.get("payment");

		if (paymentStatus === "success") {
			toast.success("Payment successful! You are now enrolled.");
			setSearchParams({}, { replace: true });
		} else if (paymentStatus === "canceled") {
			toast.error("Payment was canceled.");
			setSearchParams({}, { replace: true });
		}
	}, [searchParams, setSearchParams]);

	if (isPending) {
		return <p className="p-6">Loading...</p>;
	}

	if (!course) {
		return <p className="p-6">Course not found.</p>;
	}

	// Calculate stats
	const totalModules = course.modules?.length || 0;
	const totalLessons =
		course.modules?.reduce((acc, mod) => acc + mod.lessons.length, 0) || 0;

	const isBusy = isCheckoutPending;

	return (
		<div className="flex h-[calc(100vh-65px)] overflow-hidden bg-white">
			{/* Column 1: Main Content (Details & Curriculum) */}
			<div className="w-3/4 p-6 overflow-y-auto scroll-container">
				{/* Header */}
				<h1 className="text-3xl font-bold text-gray-900 mb-4">
					{course.name}
				</h1>
				<p className="text-lg text-gray-800 mb-8">
					{course.description || "No description provided."}
				</p>

				{/* 9. Action Buttons Updated */}
				<div className="flex items-center gap-4">
					{/* This is now the "Buy Now" button */}
					<button
						onClick={() => createCheckout()}
						disabled={isBusy}
						className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md hover:bg-purple-700 disabled:bg-purple-400">
						{isBusy ? (
							<Loader2 className="w-4 h-4 animate-spin" />
						) : (
							"Buy Now"
						)}
					</button>
					{/* The "Edit Course" button remains */}
					<NavButton
						to={`/courses/${id}/edit`}
						className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
						<Edit className="w-4 h-4" />
						Edit Course
					</NavButton>
				</div>

				{/* Curriculum */}
				<h2 className="text-2xl font-bold text-gray-900 mt-10 mb-6">
					Curriculum
				</h2>
				<div className="space-y-6">
					{course.modules?.map((module, index) => (
						<div key={module.id}>
							<h3 className="text-lg font-semibold text-gray-800 mb-3">
								Module {index + 1}: {module.title}
							</h3>
							<ul className="space-y-2 pl-4 border-l-2 border-gray-200">
								{module.lessons?.map((lesson) => (
									<li
										key={lesson.id}
										className="flex items-center gap-3">
										{lessonIcon[lesson.type]}
										<span className="text-gray-700">
											{lesson.title}
										</span>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>
			</div>

			{/* Column 2: Sidebar (Metadata) */}
			<div className="flex-1 bg-gray-50 border-l border-gray-200 p-6">
				<img
					src={
						course.coverUrl || "https://via.placeholder.com/400x200"
					}
					alt={course.name}
					className="w-full rounded-lg object-cover mb-4"
				/>
				<p className="text-3xl font-bold text-gray-900 mb-6">
					${(course.price / 100).toFixed(2)}
				</p>

				<h3 className="text-lg font-semibold text-gray-900 mb-4">
					Course Stats
				</h3>
				<div className="space-y-3">
					<div className="flex items-center gap-3">
						<Layers className="w-5 h-5 text-gray-500" />
						<span className="text-gray-700">
							{totalModules} Modules
						</span>
					</div>
					<div className="flex items-center gap-3">
						<BookOpen className="w-5 h-5 text-gray-500" />
						<span className="text-gray-700">
							{totalLessons} Lessons
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}

export default CourseInfo;
