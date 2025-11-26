import { useState, useEffect, useMemo, useRef } from "react";
import {
	useForm,
	FormProvider,
	useFieldArray,
	Controller,
} from "react-hook-form";
import { useParams, Link } from "react-router-dom";
import { useGetTestForEdit } from "@/hooks/useTestQuery";
import { useTestMutation } from "@/hooks/useTestMutation";
import {
	Loader2,
	Save,
	ArrowLeft,
	CheckCircle2,
	FileText,
	Globe,
	Archive,
} from "lucide-react";
import _ from "lodash";
import MainEditor from "@/components/TestEditor/MainEditor";
import Sidebar from "@/components/TestEditor/Sidebar";
import RadixSelect from "@/components/Shared/RadixSelect";

const STATUS_OPTIONS = [
	{
		value: "DRAFT",
		label: "Nháp",
		icon: <FileText className="w-3.5 h-3.5" />,
	},
	{
		value: "PUBLIC",
		label: "Công khai",
		icon: <Globe className="w-3.5 h-3.5" />,
	},
	{
		value: "ARCHIVED",
		label: "Lưu trữ",
		icon: <Archive className="w-3.5 h-3.5" />,
	},
];

function useEditorAutoSave(callback, value, delay = 2000, isDirty = false) {
	const callbackRef = useRef(callback);

	useEffect(() => {
		callbackRef.current = callback;
	}, [callback]);

	const debouncedCallback = useMemo(
		() =>
			_.debounce((...args) => {
				if (callbackRef.current) {
					callbackRef.current(...args);
				}
			}, delay),
		[delay]
	);

	useEffect(() => {
		if (isDirty) {
			debouncedCallback(value);
		}
		return () => debouncedCallback.cancel();
	}, [value, isDirty, debouncedCallback]);
}

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
			// Convert seconds to minutes for the UI
			timeLimit: test.timeLimit ? Math.floor(test.timeLimit / 60) : 30,
			status: test.status || "DRAFT",
		},
	});

	const {
		control,
		reset,
		watch,
		formState: { isDirty },
	} = methods;

	const { fields, append, remove } = useFieldArray({
		control,
		name: "items",
		keyName: "fieldId",
	});

	const formData = watch();

	// Helper to find current status icon
	const currentStatusOption =
		STATUS_OPTIONS.find((o) => o.value === formData.status) ||
		STATUS_OPTIONS[0];

	useEditorAutoSave(
		(data) => {
			if (!testId || !data) return;

			setIsSaving(true);

			// Convert minutes back to seconds for the API
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
						// We don't need to transform timeLimit back because keepValues preserves UI state
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
		const map = {};
		let currentCount = 1;
		const items = formData.items || [];

		items.forEach((item) => {
			if (item.type === "GROUP") {
				const childrenCount = item.children?.length || 0;
				if (childrenCount === 0) {
					map[item.id] = { display: "---" };
				} else {
					const start = currentCount;
					const end = currentCount + childrenCount - 1;
					map[item.id] = {
						display: start === end ? `${start}` : `${start}-${end}`,
					};
					currentCount += childrenCount;
				}
			} else {
				map[item.id] = { display: `${currentCount}` };
				currentCount++;
			}
		});
		return map;
	}, [formData.items]);

	return (
		<FormProvider {...methods}>
			<div className="h-screen flex flex-col bg-white font-sans text-gray-900 overflow-hidden">
				{/* HEADER */}
				<header className="h-16 px-6 border-b border-gray-200 flex items-center justify-between bg-white shrink-0 z-20">
					<div className="flex items-center gap-4">
						<Link
							to="/dashboard"
							className="p-2 -ml-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all">
							<ArrowLeft className="w-5 h-5" />
						</Link>
						<div className="h-6 w-px bg-gray-200 mx-1 hidden sm:block" />

						<div className="flex items-center gap-3">
							{/* Status Dropdown */}
							<Controller
								control={control}
								name="status"
								render={({ field: { value, onChange } }) => (
									<RadixSelect
										value={value}
										onChange={(val) => onChange(val)} // This triggers isDirty
										options={STATUS_OPTIONS}
										icon={currentStatusOption.icon}
										className="w-[140px]"
									/>
								)}
							/>

							{/* Static Title Display (Truncated) */}
							<span
								className="text-lg font-bold text-gray-900 truncate max-w-[200px] sm:max-w-md"
								title={formData.title}>
								{formData.title || (
									<span className="text-gray-300 italic">
										Chưa có tiêu đề
									</span>
								)}
							</span>
						</div>
					</div>

					<div className="flex items-center gap-4">
						<div className="hidden sm:flex items-center gap-2 text-xs font-medium text-gray-500 border-r border-gray-200 pr-4 h-8">
							{isSaving ? (
								<span className="flex items-center gap-1.5 text-purple-600 animate-pulse">
									<Loader2 className="w-3 h-3 animate-spin" />{" "}
									Đang lưu...
								</span>
							) : isDirty ? (
								<span className="flex items-center gap-1.5 text-orange-500">
									<div className="w-2 h-2 rounded-full bg-orange-500" />{" "}
									Chưa lưu
								</span>
							) : lastSaved ? (
								<span className="flex items-center gap-1.5 text-green-600">
									<CheckCircle2 className="w-3.5 h-3.5" /> Đã
									lưu{" "}
									{lastSaved.toLocaleTimeString("vi-VN", {
										hour: "2-digit",
										minute: "2-digit",
									})}
								</span>
							) : null}
						</div>

						<button className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold rounded-lg shadow-sm transition-all flex items-center gap-2">
							<Save className="w-4 h-4" /> Xuất bản
						</button>
					</div>
				</header>

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
