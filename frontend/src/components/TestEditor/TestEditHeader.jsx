import { Link, useNavigate } from "react-router-dom";
import { useFormContext, Controller } from "react-hook-form";
import {
	ArrowLeft,
	Loader2,
	CheckCircle2,
	FileText,
	Globe,
	Archive,
	Check,
} from "lucide-react";
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

export default function TestEditHeader({ testId, isSaving, lastSaved }) {
	const {
		control,
		watch,
		formState: { isDirty },
	} = useFormContext();
	const navigate = useNavigate();
	const formData = watch();

	// Helper to find current status icon
	const currentStatusOption =
		STATUS_OPTIONS.find((o) => o.value === formData.status) ||
		STATUS_OPTIONS[0];

	const handleFinish = () => {
		if (!isDirty) {
			navigate(`/tests/${testId}`);
		}
	};

	return (
		<header className="h-16 px-6 border-b border-gray-200 flex items-center justify-between bg-white shrink-0 z-20">
			<div className="flex items-center gap-4">
				{/* Back Button */}
				<button
					onClick={handleFinish}
					disabled={isDirty}
					className="p-2 -ml-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
					title="Quay lại">
					<ArrowLeft className="w-5 h-5" />
				</button>

				<div className="h-6 w-px bg-gray-200 mx-1 hidden sm:block" />

				<div className="flex items-center gap-3">
					{/* Status Dropdown */}
					<Controller
						control={control}
						name="status"
						render={({ field: { value, onChange } }) => (
							<RadixSelect
								value={value}
								onChange={(val) => onChange(val)}
								options={STATUS_OPTIONS}
								icon={currentStatusOption.icon}
								className="w-[140px]"
								disabled={isSaving}
							/>
						)}
					/>

					{/* Static Title Display */}
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
				{/* Save Status Indicator */}
				<div className="hidden sm:flex items-center gap-2 text-xs font-medium text-gray-500 border-r border-gray-200 pr-4 h-8">
					{isSaving ? (
						<span className="flex items-center gap-1.5 text-purple-600 animate-pulse">
							<Loader2 className="w-3 h-3 animate-spin" /> Đang
							lưu...
						</span>
					) : isDirty ? (
						<span className="flex items-center gap-1.5 text-orange-500">
							<div className="w-2 h-2 rounded-full bg-orange-500" />{" "}
							Chưa lưu
						</span>
					) : lastSaved ? (
						<span className="flex items-center gap-1.5 text-green-600">
							<CheckCircle2 className="w-3.5 h-3.5" /> Đã lưu{" "}
							{lastSaved.toLocaleTimeString("vi-VN", {
								hour: "2-digit",
								minute: "2-digit",
							})}
						</span>
					) : null}
				</div>

				{/* Finish Button */}
				<button
					onClick={handleFinish}
					disabled={isDirty}
					className="px-5 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 disabled:cursor-not-allowed text-white text-sm font-bold rounded-lg shadow-sm transition-all flex items-center gap-2">
					Hoàn tất
				</button>
			</div>
		</header>
	);
}
