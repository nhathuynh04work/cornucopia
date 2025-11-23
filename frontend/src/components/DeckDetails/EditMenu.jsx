import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MoreHorizontal, Edit3, Trash2 } from "lucide-react";
import { useDeleteDeck } from "@/hooks/useFlashcardMutation";
import ConfirmationModal from "@/components/ConfirmationModal";
import toast from "react-hot-toast";

function EditMenu({ deck }) {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const menuRef = useRef(null);
	const navigate = useNavigate();

	const { mutate: deleteDeck, isPending } = useDeleteDeck();

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (menuRef.current && !menuRef.current.contains(event.target)) {
				setIsMenuOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () =>
			document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const handleDeleteClick = () => {
		setIsMenuOpen(false);
		setIsDeleteModalOpen(true);
	};

	const handleConfirmDelete = () => {
		deleteDeck(
			{ deckId: deck.id },
			{
				onSuccess: () => {
					setIsDeleteModalOpen(false);
					navigate("/flashcards");
					toast.success("Xoá bộ thẻ thành công!");
				},
				onError: () => {
					setIsDeleteModalOpen(false);
					toast.error("Đã xảy ra lỗi khi xoá bộ thẻ.");
				},
			}
		);
	};

	return (
		<>
			<div className="relative" ref={menuRef}>
				<button
					onClick={() => setIsMenuOpen(!isMenuOpen)}
					className="p-2.5 text-gray-500 hover:text-gray-900 hover:bg-white bg-gray-100/50 rounded-xl transition-all border border-transparent hover:border-gray-200">
					<MoreHorizontal className="w-5 h-5" />
				</button>

				{isMenuOpen && (
					<div className="absolute right-0 mt-2 w-48 bg-white rounded-xl border border-gray-100 py-1 z-50 animate-in fade-in zoom-in-95 duration-100 shadow-lg">
						<Link
							to={`/flashcards/${deck.id}/edit`}
							className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-purple-600 transition-colors w-full text-left">
							<Edit3 className="w-4 h-4" />
							Chỉnh sửa
						</Link>
						<button
							onClick={handleDeleteClick}
							className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors w-full text-left">
							<Trash2 className="w-4 h-4" />
							Xóa bộ thẻ
						</button>
					</div>
				)}
			</div>

			{isDeleteModalOpen && (
				<ConfirmationModal
					title="Xóa bộ thẻ"
					confirmText="Xóa vĩnh viễn"
					variant="danger"
					isLoading={isPending}
					onConfirm={handleConfirmDelete}
					onCancel={() => setIsDeleteModalOpen(false)}>
					Bạn có chắc chắn muốn xóa bộ thẻ{" "}
					<strong>{deck.title}</strong> không?
					<br />
					Hành động này không thể hoàn tác và tất cả thẻ ghi nhớ bên
					trong sẽ bị mất.
				</ConfirmationModal>
			)}
		</>
	);
}

export default EditMenu;
