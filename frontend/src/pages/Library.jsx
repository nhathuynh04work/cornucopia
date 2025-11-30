import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Layers, Loader2, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useGetLibrary } from "@/hooks/useUserQuery";
import { useCreateCourse, useDeleteCourse } from "@/hooks/useCourseMutation";
import { useCreatePost, useDeletePost } from "@/hooks/usePostMutation";
import { useCreateTest, useTestMutation } from "@/hooks/useTestMutation";
import { useCreateDeck, useDeleteDeck } from "@/hooks/useFlashcardMutation";

import LibraryProfile from "@/components/Library/LibraryProfile";
import LearningTab from "@/components/Library/LearningTab";
import CreationsTab from "@/components/Library/CreationsTab";
import ConfirmationModal from "@/components/Shared/ConfirmationModal";

const TabButton = ({ active, onClick, icon: Icon, label }) => (
	<button
		onClick={onClick}
		className={`flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-xl transition-all ${
			active
				? "bg-purple-600 text-white shadow-lg shadow-purple-200"
				: "bg-white text-gray-600 hover:bg-gray-100"
		}`}>
		<Icon className="w-4 h-4" />
		{label}
	</button>
);

export default function UserLibrary() {
	const navigate = useNavigate();
	const [activeTab, setActiveTab] = useState("learning");

	const [deleteModal, setDeleteModal] = useState({
		isOpen: false,
		type: null,
		id: null,
		title: "",
	});

	const { data, isLoading, isError, refetch } = useGetLibrary();

	// Mutations
	const createCourseMutation = useCreateCourse();
	const deleteCourseMutation = useDeleteCourse();

	const createDeckMutation = useCreateDeck();
	const deleteDeckMutation = useDeleteDeck();

	const createPostMutation = useCreatePost();
	const deletePostMutation = useDeletePost();

	const createTestMutation = useCreateTest();
	const { deleteTestMutation } = useTestMutation();

	const formatDate = (dateString) => {
		if (!dateString) return "";
		return format(new Date(dateString), "dd/MM/yyyy", { locale: vi });
	};

	const handleCreate = (type) => {
		let mutation;

		switch (type) {
			case "khóa học":
				mutation = createCourseMutation;
				break;
			case "bộ thẻ":
				mutation = createDeckMutation;
				break;
			case "bài viết":
				mutation = createPostMutation;
				break;
			case "đề thi":
				mutation = createTestMutation;
				break;
			default:
				return;
		}

		const toastId = toast.loading(`Đang tạo ${type}...`);

		mutation.mutate(
			{},
			{
				onSuccess: (newItem) => {
					toast.success(`Tạo ${type} thành công`, { id: toastId });

					if (type === "khóa học")
						navigate(`/courses/${newItem.id}/edit`);
					if (type === "bộ thẻ")
						navigate(`/decks/${newItem.id}/edit`);
					if (type === "bài viết")
						navigate(`/posts/${newItem.id}/edit`);
					if (type === "đề thi")
						navigate(`/tests/${newItem.id}/edit`);
				},
				onError: () => {
					toast.error(`Không thể tạo ${type}`, { id: toastId });
				},
			}
		);
	};

	const handleDeleteClick = (type, id, title) => {
		setDeleteModal({
			isOpen: true,
			type,
			id,
			title: title || type,
		});
	};

	const closeDeleteModal = () => {
		setDeleteModal((prev) => ({ ...prev, isOpen: false }));
	};

	const handleConfirmDelete = () => {
		const { type, id } = deleteModal;
		if (!type || !id) return;

		let mutation;
		let payload;

		switch (type) {
			case "khóa học":
				mutation = deleteCourseMutation;
				payload = { courseId: id };
				break;
			case "bộ thẻ":
				mutation = deleteDeckMutation;
				payload = { deckId: id };
				break;
			case "bài viết":
				mutation = deletePostMutation;
				payload = { postId: id };
				break;
			case "đề thi":
				mutation = deleteTestMutation;
				payload = { testId: id };
				break;
			default:
				return;
		}

		mutation.mutate(payload, {
			onSuccess: () => {
				toast.success(`Đã xóa ${type} thành công`);
				closeDeleteModal();
			},
			onError: () => {
				toast.error(`Không thể xóa ${type}. Vui lòng thử lại.`);
			},
		});
	};

	const isDeleting =
		deleteCourseMutation.isPending ||
		deleteDeckMutation.isPending ||
		deletePostMutation.isPending ||
		deleteTestMutation.isPending;

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50/50">
				<Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
			</div>
		);
	}

	if (isError) {
		return (
			<div className="min-h-screen flex flex-col items-center justify-center bg-gray-50/50 gap-4">
				<AlertCircle className="w-12 h-12 text-red-500" />
				<p className="text-gray-600 font-medium">
					Không thể tải dữ liệu thư viện.
				</p>
				<button
					onClick={() => refetch()}
					className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-bold">
					Thử lại
				</button>
			</div>
		);
	}

	if (!data) return null;

	const { user, learning, creations } = data;
	const isCreator = user.role === "CREATOR" || user.role === "ADMIN";

	return (
		<div className="min-h-screen bg-gray-50/50 pb-12 relative">
			<div className="max-w-[1200px] mx-auto px-6 py-8">
				<LibraryProfile
					user={user}
					isCreator={isCreator}
					formatDate={formatDate}
				/>

				<div className="flex gap-4 mb-8">
					<TabButton
						active={activeTab === "learning"}
						onClick={() => setActiveTab("learning")}
						icon={BookOpen}
						label="Đang học"
					/>
					<TabButton
						active={activeTab === "creations"}
						onClick={() => setActiveTab("creations")}
						icon={Layers}
						label="Kho tài nguyên"
					/>
				</div>

				{activeTab === "learning" && (
					<LearningTab data={learning} formatDate={formatDate} />
				)}

				{activeTab === "creations" && (
					<CreationsTab
						data={creations}
						isCreator={isCreator}
						onCreate={handleCreate}
						onDelete={handleDeleteClick}
						deletingId={null}
						formatDate={formatDate}
						creationLoading={{
							course: createCourseMutation.isPending,
							deck: createDeckMutation.isPending,
							post: createPostMutation.isPending,
							test: createTestMutation.isPending,
						}}
					/>
				)}
			</div>

			{deleteModal.isOpen && (
				<ConfirmationModal
					title={`Xóa ${deleteModal.type}?`}
					confirmText="Xóa ngay"
					variant="danger"
					isLoading={isDeleting}
					onConfirm={handleConfirmDelete}
					onCancel={closeDeleteModal}>
					<p>
						Bạn có chắc chắn muốn xóa <b>{deleteModal.title}</b>{" "}
						không?
						<br />
						Hành động này không thể hoàn tác và toàn bộ dữ liệu liên
						quan sẽ bị mất.
					</p>
				</ConfirmationModal>
			)}
		</div>
	);
}
