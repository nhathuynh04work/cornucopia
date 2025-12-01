import { useState } from "react";
import { useParams } from "react-router-dom";
import {
	BookOpen,
	Layers,
	FileText,
	FileQuestion,
	Loader2,
	AlertCircle,
} from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import { useGetUserProfile } from "@/hooks/useUserQuery";
import { useUpdateSelf } from "@/hooks/useUserMutation";

import CourseCard from "@/components/Courses/CourseCard";
import DeckCard from "@/components/Decks/DeckCard";
import PostCard from "@/components/Posts/PostCard";
import TestCard from "@/components/Tests/TestCard";

import ProfileHeader from "@/components/Profile/ProfileHeader";
import ProfileSettingsModal from "@/components/Profile/ProfileSettingsModal";
import ProfileTabs from "@/components/Profile/ProfileTabs";
import ProfileToolbar from "@/components/Profile/ProfileToolbar";
import PaginatedList from "@/components/Profile/PaginatedList";
import ProfileLearningTab from "@/components/Profile/ProfileLearningTab";

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

	// --- Tabs Definition ---
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

	// --- Content Logic ---
	const getTabContent = () => {
		if (activeTab === "learning") {
			return { type: "composite" };
		}

		let items = [];
		let renderFn = null;
		let emptyMsg = "";

		switch (activeTab) {
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

		processedItems.sort((a, b) => {
			const dateA = new Date(a.createdAt);
			const dateB = new Date(b.createdAt);
			return sortBy === "newest" ? dateB - dateA : dateA - dateB;
		});

		return { type: "list", items: processedItems, renderFn, emptyMsg };
	};

	const currentContent = getTabContent();
	const activeTabLabel = tabs.find((t) => t.id === activeTab)?.label || "";

	return (
		<div className="min-h-screen bg-gray-50/50 pb-12">
			<div className="max-w-6xl mx-auto px-4 md:px-6 pt-8">
				<ProfileHeader
					user={profileUser}
					isOwnProfile={isOwnProfile}
					onEdit={() => setIsSettingsOpen(true)}
				/>

				<ProfileTabs
					tabs={tabs}
					activeTab={activeTab}
					onTabChange={(id) => {
						setActiveTab(id);
						setSearchTerm("");
					}}
				/>

				{currentContent.type === "list" && (
					<ProfileToolbar
						searchTerm={searchTerm}
						onSearchChange={setSearchTerm}
						sortBy={sortBy}
						onSortChange={setSortBy}
						activeTabLabel={activeTabLabel}
						isOwnProfile={isOwnProfile}
					/>
				)}

				<div className="min-h-[400px]">
					{currentContent.type === "composite" ? (
						<ProfileLearningTab learning={learning} />
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
