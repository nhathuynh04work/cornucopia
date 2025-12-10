import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as Popover from "@radix-ui/react-popover";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { useDeleteDeck } from "@/hooks/useFlashcardMutation";
import ConfirmationModal from "@/components/Shared/ConfirmationModal";
import toast from "react-hot-toast";

function EditMenu({ deck }) {
	const navigate = useNavigate();
	const [isOpen, setIsOpen] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const { mutate: deleteDeck, isPending: isDeleting } = useDeleteDeck();

	const handleDelete = () => {
		deleteDeck(
			{ deckId: deck.id },
			{
				onSuccess: () => {
					toast.success("Đã xóa bộ thẻ");
					navigate("/decks");
				},
				onError: () => {
					toast.error("Không thể xóa bộ thẻ");
				},
			}
		);
	};

	return (
		<>
			<Popover.Root open={isOpen} onOpenChange={setIsOpen}>
				<Popover.Trigger asChild>
					<button className="p-2.5 text-gray-500 hover:text-gray-900 hover:bg-gray-50 bg-white rounded-xl transition-all border-2 border-gray-200 hover:border-gray-300 outline-none data-[state=open]:border-purple-300 data-[state=open]:ring-4 data-[state=open]:ring-purple-100">
						<MoreVertical className="w-5 h-5" />
					</button>
				</Popover.Trigger>

				<Popover.Portal>
					<Popover.Content
						className="min-w-[160px] bg-white rounded-xl shadow-xl border border-gray-100 p-1.5 z-50 animate-in fade-in zoom-in-95 duration-200"
						sideOffset={5}
						align="end">
						<Link
							to={`/decks/${deck.id}/edit`}
							onClick={() => setIsOpen(false)}
							className="flex items-center gap-2 w-full px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-purple-600 rounded-lg transition-colors">
							<Pencil className="w-4 h-4" />
							Chỉnh sửa
						</Link>
						<button
							onClick={() => {
								setIsOpen(false);
								setShowDeleteModal(true);
							}}
							className="flex items-center gap-2 w-full px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors">
							<Trash2 className="w-4 h-4" />
							Xóa bộ thẻ
						</button>
					</Popover.Content>
				</Popover.Portal>
			</Popover.Root>

			{showDeleteModal && (
				<ConfirmationModal
					title="Xóa bộ thẻ"
					confirmText="Xóa vĩnh viễn"
					variant="danger"
					isLoading={isDeleting}
					onConfirm={handleDelete}
					onCancel={() => setShowDeleteModal(false)}>
					Bạn có chắc chắn muốn xóa bộ thẻ "
					<span className="font-bold text-gray-900">
						{deck.title}
					</span>
					"? Hành động này không thể hoàn tác.
				</ConfirmationModal>
			)}
		</>
	);
}

export default EditMenu;
