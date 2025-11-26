import { useState, useEffect, useMemo, useRef } from "react";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
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
import clsx from "clsx";
import MainEditor from "@/components/TestEditor/MainEditor";
import Sidebar from "@/components/TestEditor/Sidebar";

const STATUS_CONFIG = {
	DRAFT: {
		label: "Nháp",
		color: "bg-gray-100 text-gray-600",
		icon: FileText,
	},
	PUBLIC: {
		label: "Công khai",
		color: "bg-green-100 text-green-700",
		icon: Globe,
	},
	ARCHIVED: {
		label: "Lưu trữ",
		color: "bg-yellow-100 text-yellow-700",
		icon: Archive,
	},
};

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
			timeLimit: test.timeLimit || 30,
			status: test.status || "DRAFT",
		},
	});

	const {
		register,
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
	const status = formData.status || "DRAFT";
	const StatusIcon = STATUS_CONFIG[status].icon;

	useEffect(() => {
		if (test) {
			reset(test);
		}
	}, [test, reset]);

	useEditorAutoSave(
		(data) => {
			if (!testId || !data) return;

			setIsSaving(true);

			syncTestMutation.mutate(
				{
					id: testId,
					data: {
						...data,
					},
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
							to={`/tests/${test.id}`}
							className="p-2 -ml-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all">
							<ArrowLeft className="w-5 h-5" />
						</Link>
						<div className="h-6 w-px bg-gray-200 mx-1 hidden sm:block" />

						<div className="flex items-center gap-3">
							<span
								className={clsx(
									"flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide",
									STATUS_CONFIG[status].color
								)}>
								<StatusIcon className="w-3 h-3" />
								{STATUS_CONFIG[status].label}
							</span>
							<input
								{...register("title", { required: true })}
								className="text-lg font-bold text-gray-900 border-none focus:ring-0 p-0 placeholder:text-gray-300 w-64 sm:w-96 bg-transparent truncate"
								placeholder="Nhập tiêu đề bài thi..."
							/>
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

						{/* Removed Preview Button */}

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
