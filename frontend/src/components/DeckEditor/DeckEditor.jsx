import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSyncDeck, useDeleteDeck } from "@/hooks/useFlashcardMutation";
import DeckEditorHeader from "./DeckEditorHeader";
import DeckSettings from "./DeckSettings";
import CardInputList from "./CardInputList";
import DeckEditorModals from "./DeckEditorModals";
import toast from "react-hot-toast";

const deckSchema = z.object({
	title: z.string().min(1, "Vui lòng nhập tiêu đề"),
	isPublic: z.boolean(),
	cards: z.array(
		z.object({
			id: z.union([z.string(), z.number()]).optional(),
			term: z.string(),
			definition: z.string(),
		})
	),
});

function DeckEditor({ deck }) {
	const navigate = useNavigate();
	const { mutate: syncDeck, isPending: isSaving } = useSyncDeck();
	const { mutate: deleteDeck, isPending: isDeleting } = useDeleteDeck();

	const methods = useForm({
		resolver: zodResolver(deckSchema),
		defaultValues: {
			title: deck.title || "",
			isPublic: deck.isPublic || false,
			cards: deck.cards || [],
		},
	});

	const {
		control,
		handleSubmit,
		formState: { isDirty },
		getValues,
		setValue,
	} = methods;

	const { fields, append, remove } = useFieldArray({
		control,
		name: "cards",
		keyName: "_fieldId",
	});

	const [modals, setModals] = useState({
		privacy: false,
		delete: false,
		import: false,
		leave: false,
	});

	const toggleModal = (name, isOpen) => {
		setModals((prev) => ({ ...prev, [name]: isOpen }));
	};

	useEffect(() => {
		const handleBeforeUnload = (e) => {
			if (isDirty) {
				e.preventDefault();
				e.returnValue = "";
			}
		};
		window.addEventListener("beforeunload", handleBeforeUnload);
		return () =>
			window.removeEventListener("beforeunload", handleBeforeUnload);
	}, [isDirty]);

	const handleBack = () => {
		if (isDirty) {
			toggleModal("leave", true);
		} else {
			navigate(-1);
		}
	};

	const handleConfirmLeave = () => {
		toggleModal("leave", false);
		navigate(-1);
	};

	const handleImportCards = (importedCards) => {
		append(importedCards);
		toggleModal("import", false);
	};

	const handlePrivacyConfirm = (isPublic) => {
		setValue("isPublic", isPublic, { shouldDirty: true });
	};

	const handleConfirmDeleteDeck = () => {
		deleteDeck(deck.id, {
			onSuccess: () => navigate("/flashcards"),
			onError: () => toast.error("Xóa thất bại."),
		});
	};

	const onSubmit = (data) => {
		const validCards = data.cards.filter((c) => c.term.trim());

		const payload = {
			title: data.title,
			isPublic: data.isPublic,
			cards: validCards.map((c) => ({
				id: typeof c.id === "string" ? undefined : c.id,
				term: c.term,
				definition: c.definition,
			})),
		};

		syncDeck(
			{ deckId: deck.id, payload },
			{
				onSuccess: () => {
					navigate(`/flashcards/${deck.id}`);
				},
				onError: () => {
					toast.error("Lưu thất bại. Vui lòng thử lại.");
				},
			}
		);
	};

	return (
		<div className="text-gray-900 pb-20 bg-white min-h-screen">
			<FormProvider {...methods}>
				<DeckEditorHeader
					isSaving={isSaving}
					onSave={handleSubmit(onSubmit)}
					onBack={handleBack}
				/>

				<div className="w-5/6 mx-auto pt-8">
					<DeckSettings
						onImportClick={() => toggleModal("import", true)}
						onPrivacyClick={() => toggleModal("privacy", true)}
						onDeleteClick={() => toggleModal("delete", true)}
						currentPrivacy={getValues("isPublic")}
					/>

					<CardInputList
						fields={fields}
						remove={remove}
						append={append}
					/>
				</div>

				<DeckEditorModals
					modals={modals}
					toggleModal={toggleModal}
					isPublic={getValues("isPublic")}
					isDeleting={isDeleting}
					onImport={handleImportCards}
					onPrivacyConfirm={handlePrivacyConfirm}
					onDeleteConfirm={handleConfirmDeleteDeck}
					onLeaveConfirm={handleConfirmLeave}
				/>
			</FormProvider>
		</div>
	);
}

export default DeckEditor;
