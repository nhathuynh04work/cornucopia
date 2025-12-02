import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSyncDeck, useDeleteDeck } from "@/hooks/useFlashcardMutation";
import { useEditorAutoSave } from "@/hooks/useEditorAutoSave";
import DeckEditorHeader from "./DeckEditorHeader";
import DeckSettings from "./DeckSettings";
import CardInputList from "./CardInputList";
import DeckEditorModals from "./DeckEditorModals";
import toast from "react-hot-toast";

const deckSchema = z.object({
	title: z.string().min(1, "Vui lòng nhập tiêu đề"),
	isPublic: z.boolean(),
	level: z.string().optional(),
	language: z.string().optional(),
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
	const [lastSaved, setLastSaved] = useState(
		deck.updatedAt ? new Date(deck.updatedAt) : null
	);

	const methods = useForm({
		resolver: zodResolver(deckSchema),
		defaultValues: {
			title: deck.title || "",
			isPublic: deck.isPublic || false,
			level: deck.level || "ALL_LEVELS",
			language: deck.language || "ENGLISH",
			cards: deck.cards || [],
		},
	});

	const {
		control,
		formState: { isDirty },
		getValues,
		setValue,
		watch,
		reset,
	} = methods;

	const { fields, append, remove } = useFieldArray({
		control,
		name: "cards",
		keyName: "_fieldId",
	});

	const [modals, setModals] = useState({
		settings: false,
		delete: false,
		import: false,
		leave: false,
	});

	const formValues = watch();

	const handleAutoSave = (data) => {
		if (!data.title?.trim()) return;

		const validCards = data.cards.filter((c) => c.term.trim());

		const payload = {
			title: data.title,
			isPublic: data.isPublic,
			level: data.level,
			language: data.language,
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
					setLastSaved(new Date());
					reset(data);
				},
				onError: () => {
					toast.error("Lưu tự động thất bại.");
				},
			}
		);
	};

	useEditorAutoSave(handleAutoSave, formValues, 2000, isDirty);

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

	const handleSettingsConfirm = (level, language) => {
		setValue("level", level, { shouldDirty: true });
		setValue("language", language, { shouldDirty: true });
	};

	const handleConfirmDeleteDeck = () => {
		deleteDeck(deck.id, {
			onSuccess: () => navigate("/decks"),
			onError: () => toast.error("Xóa thất bại."),
		});
	};

	return (
		<div className="text-gray-900 pb-20 bg-white min-h-screen">
			<FormProvider {...methods}>
				<DeckEditorHeader
					title={watch("title")}
					isSaving={isSaving}
					isDirty={isDirty}
					lastSaved={lastSaved}
					onBack={handleBack}
					deckId={deck.id}
					control={control}
				/>

				<div className="w-5/6 mx-auto pt-8">
					<DeckSettings
						onImportClick={() => toggleModal("import", true)}
						onSettingsClick={() => toggleModal("settings", true)}
						onDeleteClick={() => toggleModal("delete", true)}
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
					level={getValues("level")}
					language={getValues("language")}
					isDeleting={isDeleting}
					onImport={handleImportCards}
					onSettingsConfirm={handleSettingsConfirm}
					onDeleteConfirm={handleConfirmDeleteDeck}
					onLeaveConfirm={handleConfirmLeave}
				/>
			</FormProvider>
		</div>
	);
}

export default DeckEditor;
