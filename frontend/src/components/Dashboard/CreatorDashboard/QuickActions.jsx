import { useNavigate } from "react-router";
import {
	Plus,
	BookOpen,
	FileText,
	PenTool,
	Layers,
	Loader2,
} from "lucide-react";
import DashboardSection from "@/components/Dashboard/DashboardSection";
import { useCreateCourse } from "@/hooks/useCourseMutation";
import { useCreateList } from "@/hooks/useListMutation";
import { useCreateTest } from "@/hooks/useTestMutation";
import toast from "react-hot-toast";
import { useCreatePost } from "@/hooks/usePostMutation";

export default function QuickActions() {
	const navigate = useNavigate();

	const { mutate: createCourse, isPending: isCreatingCourse } =
		useCreateCourse();
	const { mutate: createList, isPending: isCreatingList } = useCreateList();
	const { mutate: createTest, isPending: isCreatingTest } = useCreateTest();
	const { mutate: createPost, isPending: isCreatingPost } = useCreatePost();

	function handleCreateTest() {
		createTest(
			{ title: "Bài kiểm tra mới", description: "" },
			{
				onSuccess: (test) => {
					toast.success("Đã tạo bài kiểm tra! Bắt đầu thôi.");
					navigate(`/tests/${test.id}/edit`);
				},
				onError: () => toast.error("Không thể tạo bài kiểm tra."),
			}
		);
	}

	function handleCreateCourse() {
		createCourse(
			{
				name: "Khóa học mới",
				description: "",
				price: 100000,
			},
			{
				onSuccess: (course) => {
					toast.success("Đã tạo khóa học! Bắt đầu thôi.");
					navigate(`/courses/${course.id}/edit`);
				},
				onError: () => toast.error("Không thể tạo khóa học."),
			}
		);
	}

	function handleCreateList() {
		createList(
			{ title: "Danh sách mới" },
			{
				onSuccess: (list) => {
					toast.success("Đã tạo danh sách! Bắt đầu thôi.");
					navigate(`/flashcards/${list.id}/edit`);
				},
				onError: () => toast.error("Không thể tạo danh sách."),
			}
		);
	}

	function handleCreatePost() {
		createPost(
			{},
			{
				onSuccess: (post) => {
					toast.success("Đã tạo bài viết! Bắt đầu thôi.");
					navigate(`/posts/${post.id}/edit`);
				},
				onError: () => toast.error("Không thể tạo bài viết."),
			}
		);
	}

	const actions = [
		{
			title: "Tạo Khóa Học",
			icon: BookOpen,
			onClick: handleCreateCourse,
			isLoading: isCreatingCourse,
			color: "text-purple-600",
			bg: "bg-purple-50",
			hoverBorder: "group-hover:border-purple-300",
		},
		{
			title: "Tạo Bài Test",
			icon: FileText,
			onClick: handleCreateTest,
			isLoading: isCreatingTest,
			color: "text-blue-600",
			bg: "bg-blue-50",
			hoverBorder: "group-hover:border-blue-300",
		},
		{
			title: "Viết Blog",
			icon: PenTool,
			onClick: handleCreatePost,
			isLoading: isCreatingPost,
			color: "text-pink-600",
			bg: "bg-pink-50",
			hoverBorder: "group-hover:border-pink-300",
		},
		{
			title: "Tạo Flashcard",
			icon: Layers,
			onClick: handleCreateList,
			isLoading: isCreatingList,
			color: "text-amber-600",
			bg: "bg-amber-50",
			hoverBorder: "group-hover:border-amber-300",
		},
	];

	return (
		<DashboardSection title="Thao tác nhanh">
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
				{actions.map((action, index) => {
					const Icon = action.icon;
					const commonClasses = `group relative flex flex-col items-center justify-center p-6 bg-white rounded-xl border border-gray-200 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-1 ${action.hoverBorder}`;

					return (
						<button
							key={index}
							onClick={action.onClick}
							disabled={action.isLoading}
							className={`${commonClasses} w-full ${
								action.isLoading
									? "opacity-70 cursor-not-allowed hover:translate-y-0 hover:shadow-sm"
									: ""
							}`}>
							<div
								className={`p-3 rounded-full ${action.bg} mb-3 transition-transform group-hover:scale-110`}>
								{action.isLoading ? (
									<Loader2
										className={`w-6 h-6 animate-spin ${action.color}`}
									/>
								) : (
									<Icon
										className={`w-6 h-6 ${action.color}`}
									/>
								)}
							</div>
							<span className="font-medium text-gray-700 group-hover:text-gray-900">
								{action.isLoading
									? "Đang tạo..."
									: action.title}
							</span>
							{!action.isLoading && (
								<div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
									<Plus className="w-4 h-4 text-gray-400" />
								</div>
							)}
						</button>
					);
				})}
			</div>
		</DashboardSection>
	);
}
