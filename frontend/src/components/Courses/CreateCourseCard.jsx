import { Loader2, Plus } from "lucide-react";
import { useCreateCourse } from "../../hooks/useCourseMutation"; // Assuming this is your mutations file
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

function CreateCourseCard() {
	const { mutate: createCourse, isPending: isCreating } = useCreateCourse();
	const navigate = useNavigate();

	function handleCreate() {
		createCourse(
			{
				name: "New Draft Course",
				description: "",
				price: 100000,
			},
			{
				onSuccess: (course) => {
					toast.success("Course created! Let's get started.");
					navigate(`/courses/${course.id}/edit`);
				},
				onError: (err) => {
					toast.error(err.message || "Failed to create course.");
				},
			}
		);
	}

	return (
		<button
			onClick={handleCreate}
			disabled={isCreating}
			className="flex flex-col items-center justify-center h-full min-h-[200px] border-2 border-dashed border-gray-300 rounded-lg text-gray-500 transition-all hover:border-purple-300 hover:text-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed">
			{isCreating ? (
				<Loader2 className="w-10 h-10 animate-spin" />
			) : (
				<>
					<Plus className="w-10 h-10 mb-2" />
					<span className="font-semibold">Create New Course</span>
				</>
			)}
		</button>
	);
}

export default CreateCourseCard;
