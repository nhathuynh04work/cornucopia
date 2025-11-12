import { Plus } from "lucide-react";
import { useNavigate } from "react-router";
import { api } from "@/apis/axios";
import { useAuth } from "@/contexts/AuthContext";

export default function CreateListButton({ list }) {
	const navigate = useNavigate();
	const { user } = useAuth();

	const handleClick = async () => {
		try {
			let listId = list?.id;
			if (!listId) {
				const { data } = await api.post("/lists", {
					userId: user.id,
					title: "Danh sách chưa được đặt tên",
				});
				listId = data.list.id;
			}
			navigate(`/flashcards/${listId}/edit`);
		} catch (err) {
			console.error("Không thể tạo danh sách:", err);
		}
	};

	return (
		<button
			onClick={handleClick}
			title="Tạo danh sách mới"
			className="group relative flex flex-col items-center justify-center h-32 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 text-gray-500 transition-all hover:border-purple-300 hover:bg-purple-50 hover:text-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 overflow-hidden">
			<div className="absolute inset-0 bg-purple-100 opacity-0 group-hover:opacity-20 transition-opacity rounded-2xl"></div>

			<div className="flex items-center justify-center w-12 h-12 mb-2 rounded-full border-2 border-current bg-white/60">
				<Plus className="w-6 h-6" />
			</div>
		</button>
	);
}
