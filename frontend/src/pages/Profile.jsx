import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
	BookOpen,
	Layers,
	FileText,
	FileQuestion,
	Loader2,
	AlertCircle,
	ArrowLeft,
} from "lucide-react";
import { toast } from "react-hot-toast";

import { useAuth } from "@/contexts/AuthContext";
import { useGetUserProfile } from "@/hooks/useUserQuery";
import { useUpdateSelf } from "@/hooks/useUserMutation";
import { useCreateCourse } from "@/hooks/useCourseMutation";
import { useCreateDeck } from "@/hooks/useFlashcardMutation";
import { useCreateTest } from "@/hooks/useTestMutation";
import { useCreatePost } from "@/hooks/usePostMutation";

import ProfileHeader from "@/components/Profile/ProfileHeader";
import ProfileSettingsModal from "@/components/Profile/ProfileSettingsModal";
import ProfileTabs from "@/components/Profile/ProfileTabs";
import ProfileToolbar from "@/components/Profile/ProfileToolbar";

import ProfileCoursesTab from "@/components/Profile/ProfileCoursesTab";
import ProfileDecksTab from "@/components/Profile/ProfileDecksTab";
import ProfileTestsTab from "@/components/Profile/ProfileTestsTab";
import ProfilePostsTab from "@/components/Profile/ProfilePostsTab";
import ProfileLearningTab from "@/components/Profile/ProfileLearningTab";

export default function Profile() {
	const { userId } = useParams();
	const navigate = useNavigate();
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

	const { mutate: createCourse, isPending: isCreatingCourse } =
		useCreateCourse();
	const { mutate: createDeck, isPending: isCreatingDeck } = useCreateDeck();
	const { mutate: createTest, isPending: isCreatingTest } = useCreateTest();
	const { mutate: createPost, isPending: isCreatingPost } = useCreatePost();

	const isCreating =
		isCreatingCourse || isCreatingDeck || isCreatingTest || isCreatingPost;

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

	const { user: profileUser } = data;
	const isCreator =
		profileUser.role === "CREATOR" || profileUser.role === "ADMIN";

	const handleSaveProfile = (updatedData) => {
		updateProfile(updatedData, {
			onSuccess: () => setIsSettingsOpen(false),
		});
	};

	const handleCreate = () => {
		switch (activeTab) {
			case "courses":
				createCourse(
					{ title: "Khóa học mới" },
					{
						onSuccess: (data) => {
							navigate(`/courses/${data.id}/edit`);
							toast.success("Đã tạo khóa học mới");
						},
						onError: () => toast.error("Không thể tạo khóa học"),
					}
				);
				break;
			case "decks":
				createDeck(
					{ title: "Bộ thẻ mới" },
					{
						onSuccess: (data) => {
							navigate(`/decks/${data.id}`);
							toast.success("Đã tạo bộ thẻ mới");
						},
						onError: () => toast.error("Không thể tạo bộ thẻ"),
					}
				);
				break;
			case "tests":
				createTest(undefined, {
					onSuccess: (data) => {
						navigate(`/tests/${data.id}/edit`);
						toast.success("Đã tạo bài kiểm tra mới");
					},
					onError: () => toast.error("Không thể tạo bài kiểm tra"),
				});
				break;
			case "posts":
				createPost(undefined, {
					onSuccess: (data) => {
						navigate(`/posts/${data.id}/edit`);
						toast.success("Đã tạo bài viết mới");
					},
					onError: () => toast.error("Không thể tạo bài viết"),
				});
				break;
			default:
				break;
		}
	};

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
			},
			{
				id: "decks",
				label: "Bộ thẻ",
				icon: Layers,
			},
			{
				id: "tests",
				label: "Đề thi",
				icon: FileQuestion,
			},
			{
				id: "posts",
				label: "Bài viết",
				icon: FileText,
			}
		);
	} else {
		tabs.push(
			{
				id: "decks",
				label: "Bộ thẻ",
				icon: Layers,
			},
			{
				id: "posts",
				label: "Bài viết",
				icon: FileText,
			}
		);
	}

	const activeTabLabel = tabs.find((t) => t.id === activeTab)?.label || "";

	const renderTabContent = () => {
		switch (activeTab) {
			case "learning":
				return (
					<ProfileLearningTab
						userId={targetId}
						searchTerm={searchTerm}
					/>
				);
			case "courses":
				return (
					<ProfileCoursesTab
						userId={targetId}
						searchTerm={searchTerm}
						sortBy={sortBy}
					/>
				);
			case "decks":
				return (
					<ProfileDecksTab
						userId={targetId}
						searchTerm={searchTerm}
						sortBy={sortBy}
					/>
				);
			case "tests":
				return (
					<ProfileTestsTab
						userId={targetId}
						searchTerm={searchTerm}
						sortBy={sortBy}
					/>
				);
			case "posts":
				return (
					<ProfilePostsTab
						userId={targetId}
						searchTerm={searchTerm}
						sortBy={sortBy}
					/>
				);
			default:
				return null;
		}
	};

	return (
		<div className="min-h-screen bg-gray-50/50 pb-12">
			<div className="max-w-6xl mx-auto px-4 md:px-6 pt-6">
				{/* Back Button */}
				<button
					onClick={() => navigate(-1)}
					className="mb-6 flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors font-medium">
					<ArrowLeft className="w-5 h-5" />
					Quay lại
				</button>

				<ProfileHeader
					user={profileUser}
					isOwnProfile={isOwnProfile}
					onEdit={() => setIsSettingsOpen(true)}
				/>

				{/* Sticky Header Group */}
				<div className="sticky top-0 z-30 bg-gray-50/95 backdrop-blur-sm transition-all duration-200 -mx-4 px-4 md:-mx-6 md:px-6 pt-2 mb-6">
					<ProfileTabs
						tabs={tabs}
						activeTab={activeTab}
						onTabChange={(id) => {
							setActiveTab(id);
							setSearchTerm("");
							setSortBy("newest");
						}}
					/>

					{activeTab !== "learning" && (
						<ProfileToolbar
							searchTerm={searchTerm}
							onSearchChange={setSearchTerm}
							sortBy={sortBy}
							onSortChange={setSortBy}
							activeTabLabel={activeTabLabel}
							isOwnProfile={isOwnProfile}
							onCreate={handleCreate}
							isCreating={isCreating}
						/>
					)}
				</div>

				<div className="min-h-[400px]">{renderTabContent()}</div>
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
