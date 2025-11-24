import { useState } from "react";
import {
	ChevronDown,
	ChevronRight,
	Video,
	FileText,
	Clock,
	Lock,
	PlayCircle,
} from "lucide-react";
import { formatTime } from "@/lib/formatters";

const lessonIcon = {
	VIDEO: <Video className="w-4 h-4 text-purple-500" />,
	TEXT: <FileText className="w-4 h-4 text-blue-500" />,
};

export default function CourseCurriculumList({ modules, isEnrolled }) {
	const [openModules, setOpenModules] = useState({});

	const toggleModule = (id) => {
		setOpenModules((prev) => ({ ...prev, [id]: !prev[id] }));
	};

	if (!modules || modules.length === 0) {
		return (
			<div className="p-8 text-center border-2 border-dashed border-gray-100 rounded-3xl">
				<p className="text-gray-400 text-sm">
					Khóa học này chưa có nội dung.
				</p>
			</div>
		);
	}

	return (
		<div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
			<div className="p-6 border-b border-gray-100">
				<h2 className="text-xl font-bold text-gray-900">
					Nội dung khóa học
				</h2>
			</div>

			<div className="divide-y divide-gray-50">
				{modules.map((module, idx) => {
					const isOpen = openModules[module.id];
					const lessonCount = module.lessons?.length || 0;

					return (
						<div key={module.id} className="bg-white">
							<button
								onClick={() => toggleModule(module.id)}
								className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors text-left group">
								<div className="flex items-center gap-4">
									<div
										className={`p-1.5 rounded-lg transition-colors ${
											isOpen
												? "bg-purple-100 text-purple-600"
												: "bg-gray-100 text-gray-400 group-hover:text-gray-600"
										}`}>
										{isOpen ? (
											<ChevronDown className="w-5 h-5" />
										) : (
											<ChevronRight className="w-5 h-5" />
										)}
									</div>
									<div>
										<h3 className="font-bold text-gray-800 text-base">
											Chương {idx + 1}: {module.title}
										</h3>
										<p className="text-xs text-gray-500 mt-0.5">
											{lessonCount} bài học
										</p>
									</div>
								</div>
							</button>

							{isOpen && (
								<div className="bg-gray-50/50 px-5 pb-5 pt-2 space-y-2">
									{module.lessons?.map((lesson, lIdx) => (
										<div
											key={lesson.id}
											className={`flex items-center justify-between p-3 rounded-xl border border-gray-100 transition-colors ${
												isEnrolled
													? "bg-white hover:border-purple-200 cursor-pointer"
													: "bg-gray-50 opacity-75 cursor-not-allowed"
											}`}>
											<div className="flex items-center gap-3">
												<div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 font-medium text-xs border border-gray-100">
													{lIdx + 1}
												</div>
												<div className="flex flex-col">
													<span className="text-sm font-medium text-gray-700">
														{lesson.title}
													</span>
													<div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
														{
															lessonIcon[
																lesson.type
															]
														}
														<span>
															{lesson.type ===
															"VIDEO"
																? "Video"
																: "Bài đọc"}
														</span>
													</div>
												</div>
											</div>

											<div className="flex items-center gap-4">
												<div className="flex items-center gap-1 text-xs text-gray-400">
													<Clock className="w-3.5 h-3.5" />
													<span>
														{formatTime(
															lesson.duration
														)}
													</span>
												</div>
												{isEnrolled ? (
													<PlayCircle className="w-5 h-5 text-purple-400" />
												) : (
													<Lock className="w-4 h-4 text-gray-300" />
												)}
											</div>
										</div>
									))}
								</div>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
}
