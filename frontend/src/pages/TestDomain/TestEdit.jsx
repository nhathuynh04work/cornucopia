import { useState, useMemo } from "react";
import {
	useForm,
	FormProvider,
	useFieldArray,
	useWatch,
} from "react-hook-form";
import { useParams } from "react-router-dom";
import { useGetTestForEdit } from "@/hooks/useTestQuery";
import { useTestMutation } from "@/hooks/useTestMutation";
import { Loader2 } from "lucide-react";
import MainEditor from "@/components/TestEditor/MainEditor";
import Sidebar from "@/components/TestEditor/Sidebar";
import TestEditHeader from "@/components/TestEditor/TestEditHeader";
import { useEditorAutoSave } from "@/hooks/useEditorAutoSave";
import { getQuestionNumberMap } from "@/lib/testHelpers";

function TestEditForm({ test, testId }) {
	const { syncTestMutation } = useTestMutation();

	const [isSaving, setIsSaving] = useState(false);
	const [lastSaved, setLastSaved] = useState(
		test.updatedAt ? new Date(test.updatedAt) : null
	);
	const [activeItemId, setActiveItemId] = useState("test-info");

	const methods = useForm({
		defaultValues: {
			title: test.title || "",
			description: test.description || "",
			items: test.items || [],
			audioUrl: test.audioUrl || null,

			timeLimit: test.timeLimit ? Math.floor(test.timeLimit / 60) : 30,
			status: test.status || "DRAFT",
		},
	});

	const {
		control,
		reset,
		formState: { isDirty },
	} = methods;

	const { fields, append, remove } = useFieldArray({
		control,
		name: "items",
		keyName: "fieldId",
	});

	const items = useWatch({
		control,
		name: "items",
	});

	const formData = useWatch({ control });

	useEditorAutoSave(
		(data) => {
			if (!testId || !data) return;

			setIsSaving(true);

			const payload = {
				...data,
				timeLimit: data.timeLimit ? data.timeLimit * 60 : 0,
			};

			syncTestMutation.mutate(
				{
					id: testId,
					data: payload,
				},
				{
					onSuccess: (updatedTest) => {
						setIsSaving(false);
						setLastSaved(new Date(updatedTest.updatedAt));

						reset(data, { keepValues: true, keepDirty: false });
					},
					onError: () => {
						setIsSaving(false);
					},
				}
			);
		},
		formData,
		2000,
		isDirty
	);

	const questionNumberMap = useMemo(() => {
		return getQuestionNumberMap(items || []);
	}, [items]);

	return (
		<FormProvider {...methods}>
			<div className="h-screen flex flex-col bg-white font-sans text-gray-900 overflow-hidden">
				<TestEditHeader
					testId={testId}
					isSaving={isSaving}
					lastSaved={lastSaved}
				/>

				<div className="flex-1 flex overflow-hidden">
					<Sidebar
						fields={fields}
						append={append}
						remove={remove}
						activeItemId={activeItemId}
						setActiveItemId={setActiveItemId}
						questionNumberMap={questionNumberMap}
					/>

					<MainEditor
						activeItemId={activeItemId}
						fields={fields}
						remove={remove}
						questionNumberMap={questionNumberMap}
					/>
				</div>
			</div>
		</FormProvider>
	);
}

export default function TestEdit() {
	const { testId } = useParams();

	const { data: test, isLoading: isFetching } = useGetTestForEdit(testId);

	if (isFetching) {
		return (
			<div className="h-screen flex items-center justify-center bg-gray-50">
				<Loader2 className="w-10 h-10 animate-spin text-purple-600" />
			</div>
		);
	}

	return test && <TestEditForm key={test.id} test={test} testId={testId} />;
}
