import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, CheckCircle2, Globe, Lock } from "lucide-react";
import { Controller } from "react-hook-form";
import RadixSelect from "@/components/Shared/RadixSelect";

const STATUS_OPTIONS = [
	{
		value: "false",
		label: "Riêng tư",
		icon: <Lock className="w-3.5 h-3.5" />,
	},
	{
		value: "true",
		label: "Công khai",
		icon: <Globe className="w-3.5 h-3.5" />,
	},
];

function DeckEditorHeader({
	isSaving,
	isDirty,
	lastSaved,
	title,
	onBack,
	deckId,
	control,
}) {
	const navigate = useNavigate();

	const handleFinish = () => {
		if (!isDirty) {
			navigate(`/decks/${deckId}`);
		}
	};

	return (
		<header className="h-[64px] px-6 border-b border-gray-100 flex items-center justify-between bg-white shrink-0 z-50 sticky top-0">
			<div className="flex items-center gap-4">
				{/* Back Button */}
				<button
					onClick={onBack}
					className="p-2 -ml-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
					title="Quay lại">
					<ArrowLeft className="w-5 h-5" />
				</button>

				<div className="h-6 w-px bg-gray-200 mx-1 hidden sm:block" />

				<div className="flex items-center gap-3">
					{/* Status Dropdown */}
					<Controller
						control={control}
						name="isPublic"
						render={({ field: { value, onChange } }) => (
							<RadixSelect
								value={String(value)}
								onChange={(val) => onChange(val === "true")}
								options={STATUS_OPTIONS}
								icon={
									value
										? STATUS_OPTIONS[1].icon
										: STATUS_OPTIONS[0].icon
								}
								className="w-[140px]"
								disabled={isSaving}
							/>
						)}
					/>

					{/* Title Display */}
					<span
						className="text-lg font-bold text-gray-900 truncate max-w-[200px] sm:max-w-md"
						title={title}>
						{title || (
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
					) : (
						/* Always show 'Saved' if not saving/dirty, assuming we have a lastSaved timestamp or it's fresh */
						<span className="flex items-center gap-1.5 text-green-600">
							<CheckCircle2 className="w-3.5 h-3.5" />
							{lastSaved ? (
								<>
									Đã lưu{" "}
									{lastSaved.toLocaleTimeString("vi-VN", {
										hour: "2-digit",
										minute: "2-digit",
									})}
								</>
							) : (
								"Đã lưu"
							)}
						</span>
					)}
				</div>

				{/* Finish Button */}
				<button
					onClick={handleFinish}
					disabled={isDirty || isSaving}
					className="px-5 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 disabled:cursor-not-allowed text-white text-sm font-bold rounded-lg shadow-sm transition-all flex items-center gap-2">
					Hoàn tất
				</button>
			</div>
		</header>
	);
}

export default DeckEditorHeader;
