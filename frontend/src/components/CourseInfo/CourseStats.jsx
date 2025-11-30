import { BookOpen, Layers, Users, Star } from "lucide-react";

export default function CourseStats({
	totalModules,
	totalLessons,
	enrollmentCount,
	rating,
}) {
	return (
		<div className="grid grid-cols-1 gap-4">
			<InfoCard
				icon={Star}
				label="Đánh giá"
				value={`${rating || 0} sao`}
				color="text-yellow-600"
				bg="bg-yellow-50"
			/>
			<InfoCard
				icon={Users}
				label="Học viên"
				value={`${enrollmentCount} người`}
				color="text-purple-600"
				bg="bg-purple-50"
			/>
			<InfoCard
				icon={Layers}
				label="Số chương"
				value={`${totalModules} chương`}
				color="text-blue-600"
				bg="bg-blue-50"
			/>
			<InfoCard
				icon={BookOpen}
				label="Số bài học"
				value={`${totalLessons} bài`}
				color="text-orange-600"
				bg="bg-orange-50"
			/>
		</div>
	);
}

function InfoCard({ icon: Icon, label, value, color, bg }) {
	return (
		<div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
			<div className={`p-3 rounded-xl ${bg} ${color}`}>
				<Icon className="w-5 h-5" />
			</div>
			<div>
				<p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
					{label}
				</p>
				<p className="text-lg font-bold text-gray-900">{value}</p>
			</div>
		</div>
	);
}
