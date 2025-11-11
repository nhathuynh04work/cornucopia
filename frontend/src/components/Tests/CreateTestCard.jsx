import { Loader2, Plus } from "lucide-react";
import { toast } from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { create } from "@/apis/testApi";
import { useNavigate } from "react-router";

export default function CreateTestCard() {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	const { mutate: createTest, isPending } = useMutation({
		mutationFn: (data) => create(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["tests"] });
		},
	});

	function handleCreate() {
		createTest(
			{ title: "New Draft Test", description: "" },
			{
				onSuccess: (test) => {
					toast.success("Test created! Let's get started.");
					navigate(`/tests/${test.id}/edit`);
				},
				onError: (err) => {
					toast.error(err.message || "Failed to create test.");
				},
			}
		);
	}

	return (
		<button
			onClick={handleCreate}
			disabled={isPending}
			className="group relative flex flex-col items-center justify-center h-full min-h-[150px] rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 text-gray-500 transition-all hover:border-purple-300 hover:bg-purple-50 hover:text-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden">
			<div className="absolute inset-0 bg-purple-100 opacity-0 group-hover:opacity-20 transition-opacity"></div>

			{isPending ? (
				<Loader2 className="w-8 h-8 animate-spin text-purple-500" />
			) : (
				<>
					<div className="flex items-center justify-center w-12 h-12 mb-2 rounded-full border-2 border-current bg-white/60">
						<Plus className="w-6 h-6" />
					</div>
					<span className="text-sm font-medium">Create new test</span>
				</>
			)}
		</button>
	);
}
