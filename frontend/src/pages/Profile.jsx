import { useState } from "react";
import { useParams } from "react-router-dom";
import {
	BookOpen,
	Layers,
	FileText,
	FileQuestion,
	History,
	Plus,
	Search,
	Filter,
	Loader2,
	AlertCircle,
} from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import { useGetUserProfile } from "@/hooks/useUserQuery";
import { useUpdateSelf } from "@/hooks/useUserMutation";

import EmptyState from "@/components/Shared/EmptyState";
import PaginationControl from "@/components/Shared/PaginationControl";
import RadixSelect from "@/components/Shared/RadixSelect";

import CourseCard from "@/components/Courses/CourseCard";
import DeckCard from "@/components/Decks/DeckCard";
import PostCard from "@/components/Posts/PostCard";
import TestCard from "@/components/Tests/TestCard";

import ProfileHeader from "@/components/Profile/ProfileHeader";
import EnrolledCourseCard from "@/components/Profile/EnrolledCourseCard";
import AttemptItem from "@/components/Profile/AttemptItem";
import ProfileSettingsModal from "@/components/Profile/ProfileSettingsModal";

const SORT_OPTIONS = [
	{ value: "newest", label: "Mới nhất" },
	{ value: "oldest", label: "Cũ nhất" },
];

export default function Profile() {
	const { userId } = useParams();
	const { user: currentUser } = useAuth();

	const targetId = !userId || userId === "me" ? currentUser?.id : userId;
	const isOwnProfile = Number(targetId) === currentUser?.id;

	const [activeTab, setActiveTab] = useState(
		isOwnProfile ? "learning" : "decks"
	);
	const [searchTerm, setSearchTerm] = useState("");
	const [sortBy, setSortBy] = useState("newest");
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);

	const { data, isLoading, isError } = useGetUserProfile(targetId);
	const { mutate: updateProfile, isPending: isUpdating } = useUpdateSelf();

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50/50">
				<Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
			</div>
		);
	}

	if (isError || !data) {
		return (
			<div className="min-h-screen flex flex-col items-center justify-center bg-gray-50/50 gap-4">
				<AlertCircle className="w-12 h-12 text-red-500" />
				<p className="text-gray-600 font-medium">
					Không tìm thấy hồ sơ người dùng.
				</p>
			</div>
		);
	}

	const { user: profileUser, learning, creations } = data;
	const isCreator =
		profileUser.role === "CREATOR" || profileUser.role === "ADMIN";

	const handleSaveProfile = (updatedData) => {
		updateProfile(updatedData, {
			onSuccess: () => setIsSettingsOpen(false),
		});
	};

	const getTabContent = () => {
		let items = [];
		let renderFn = null;
		let emptyMsg = "";

		switch (activeTab) {
			case "learning":
				return { type: "composite" };
			case "courses":
				items = creations.courses || [];
				renderFn = (item) => <CourseCard course={item} />;
				emptyMsg = "Chưa có khóa học nào.";
				break;
			case "decks":
				items = creations.decks || [];
				renderFn = (item) => <DeckCard deck={item} />;
				emptyMsg = "Chưa có bộ thẻ nào.";
				break;
			case "tests":
				items = creations.tests || [];
				renderFn = (item) => <TestCard test={item} />;
				emptyMsg = "Chưa có đề thi nào.";
				break;
			case "posts":
				items = creations.posts || [];
				renderFn = (item) => <PostCard post={item} />;
				emptyMsg = "Chưa có bài viết nào.";
				break;
			default:
				return { type: "empty" };
		}

		let processedItems = [...items];
		if (searchTerm) {
			const lower = searchTerm.toLowerCase();
			processedItems = processedItems.filter((i) =>
				i.title?.toLowerCase().includes(lower)
			);
		}
		if (sortBy === "newest") {
			processedItems.sort(
				(a, b) => new Date(b.createdAt) - new Date(a.createdAt)
			);
		} else {
			processedItems.sort(
				(a, b) => new Date(a.createdAt) - new Date(b.createdAt)
			);
		}

		return { type: "list", items: processedItems, renderFn, emptyMsg };
	};

	const currentContent = getTabContent();

	const tabs = [];
	if (isOwnProfile) {
		tabs.push({ id: "learning", label: "Đang học", icon: BookOpen });
	}

	if (isCreator) {
		tabs.push(
			{
				id: "courses",
				label: "Khóa học",
				icon: BookOpen,
				count: creations.courses?.length,
			},
			{
				id: "decks",
				label: "Bộ thẻ",
				icon: Layers,
				count: creations.decks?.length,
			},
			{
				id: "tests",
				label: "Đề thi",
				icon: FileQuestion,
				count: creations.tests?.length,
			},
			{
				id: "posts",
				label: "Bài viết",
				icon: FileText,
				count: creations.posts?.length,
			}
		);
	} else {
		tabs.push(
			{
				id: "decks",
				label: "Bộ thẻ",
				icon: Layers,
				count: creations.decks?.length,
			},
			{
				id: "posts",
				label: "Bài viết",
				icon: FileText,
				count: creations.posts?.length,
			}
		);
	}

	return (
		<div className="min-h-screen bg-gray-50/50 pb-12">
			{/* Page Header */}
			<div className="max-w-6xl mx-auto px-4 md:px-6 pt-8">
				<ProfileHeader
					user={profileUser}
					isOwnProfile={isOwnProfile}
					onEdit={() => setIsSettingsOpen(true)}
				/>

				{/* Tabs */}
				<div className="flex border-b border-gray-200 mb-6 md:mb-8 overflow-x-auto hide-scrollbar">
					{tabs.map((tab) => (
						<button
							key={tab.id}
							onClick={() => {
								setActiveTab(tab.id);
								setSearchTerm("");
							}}
							className={`flex items-center gap-2 px-5 py-3 text-sm font-bold whitespace-nowrap transition-all border-b-2 -mb-px ${
								activeTab === tab.id
									? "border-purple-600 text-purple-700"
									: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
							}`}>
							<tab.icon className="w-4 h-4" />
							{tab.label}
							{tab.count !== undefined && (
								<span
									className={`ml-1 text-[10px] py-0.5 px-2 rounded-full ${
										activeTab === tab.id
											? "bg-purple-100 text-purple-700"
											: "bg-gray-100 text-gray-500"
									}`}>
									{tab.count}
								</span>
							)}
						</button>
					))}
				</div>

				{/* Toolbar */}
				{currentContent.type === "list" && (
					<div className="flex flex-col sm:flex-row gap-4 mb-6">
						<div className="relative flex-1 group w-full">
							<input
								type="text"
								placeholder={`Tìm kiếm ${tabs
									.find((t) => t.id === activeTab)
									?.label.toLowerCase()}...`}
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 bg-white text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition-all shadow-sm"
							/>
							<Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-purple-500 transition-colors" />
						</div>

						<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
							<RadixSelect
								value={sortBy}
								onChange={setSortBy}
								options={SORT_OPTIONS}
								icon={<Filter className="w-4 h-4" />}
								className="w-full sm:w-[160px]"
							/>

							{isOwnProfile && (
								<button className="flex justify-center items-center gap-1.5 px-3 py-2 bg-purple-600 text-white rounded-lg text-xs font-bold hover:bg-purple-700 shadow-md shadow-purple-100 transition-all shrink-0 w-full sm:w-auto">
									<Plus className="w-4 h-4" />
									<span>Tạo mới</span>
								</button>
							)}
						</div>
					</div>
				)}

				{/* Content Area */}
				<div className="min-h-[400px]">
					{currentContent.type === "composite" ? (
						<div className="space-y-12">
							{/* Learning Courses */}
							<section>
								<div className="flex items-center justify-between mb-4">
									<h3 className="flex items-center gap-2 text-lg font-bold text-gray-900">
										<BookOpen className="w-5 h-5 text-purple-600" />
										Khóa học đang tham gia
									</h3>
								</div>
								<PaginatedList
									items={learning.courses || []}
									renderItem={(item) => (
										<EnrolledCourseCard course={item} />
									)}
									itemsPerPage={3}
									emptyMessage="Bạn chưa tham gia khóa học nào."
								/>
							</section>

							{/* Recent Attempts */}
							<section>
								<h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-4">
									<History className="w-5 h-5 text-blue-600" />
									Lịch sử làm bài thi
								</h3>
								<PaginatedList
									items={learning.attempts || []}
									renderItem={(item) => (
										<AttemptItem attempt={item} />
									)}
									itemsPerPage={5}
									emptyMessage="Bạn chưa thực hiện bài thi nào."
								/>
							</section>
						</div>
					) : (
						<PaginatedList
							items={currentContent.items}
							renderItem={currentContent.renderFn}
							emptyMessage={currentContent.emptyMsg}
							itemsPerPage={5}
						/>
					)}
				</div>
			</div>

			<ProfileSettingsModal
				isOpen={isSettingsOpen}
				onClose={() => setIsSettingsOpen(false)}
				user={profileUser}
				onSave={handleSaveProfile}
				isSaving={isUpdating}
			/>
		</div>
	);
}

function PaginatedList({ items, renderItem, itemsPerPage = 5, emptyMessage }) {
	const [currentPage, setCurrentPage] = useState(1);

	if (items.length > 0 && (currentPage - 1) * itemsPerPage >= items.length) {
		setCurrentPage(1);
	}

	const totalPages = Math.ceil(items.length / itemsPerPage);
	const startIndex = (currentPage - 1) * itemsPerPage;
	const currentItems = items.slice(startIndex, startIndex + itemsPerPage);

	if (items.length === 0) {
		return <EmptyState message={emptyMessage} icon={Layers} />;
	}

	return (
		<div className="space-y-6">
			<div className="flex flex-col gap-4">
				{currentItems.map((item) => (
					<div
						key={item.id}
						className="w-full relative group animate-in fade-in slide-in-from-bottom-2 duration-300">
						{renderItem(item)}
					</div>
				))}
			</div>

			<PaginationControl
				currentPage={currentPage}
				totalPages={totalPages}
				onPageChange={setCurrentPage}
			/>
		</div>
	);
}
