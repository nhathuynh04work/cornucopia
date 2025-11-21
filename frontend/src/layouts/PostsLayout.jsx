import { useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import TabsSearchbarLayout from "./TabSearchbarLayout";
import { Role } from "@/lib/constants";

const TABS = {
	ALL: { title: "Toàn bộ", key: "all", path: "/posts/all" },
	MY_POSTS: {
		title: "Bài viết của tôi",
		key: "my",
		path: "/posts/my",
	},
	DRAFT: { title: "Bản nháp", key: "draft", path: "/posts/draft" },
};

function PostsLayout() {
	const { role } = useAuth();

	const visibleTabs = useMemo(() => {
		// For admin/creator
		if (role === Role.ADMIN || role === Role.CREATOR) {
			return [TABS.ALL, TABS.MY_POSTS, TABS.DRAFT];
		}

		// For a logged-in user
		if (role === Role.USER) {
			return [TABS.ALL];
		}

		// Visitor
		return [TABS.ALL];
	}, [role]);

	return (
		<TabsSearchbarLayout
			tabs={visibleTabs}
			searchPlaceholder="Tìm kiếm bài viết..."
		/>
	);
}

export default PostsLayout;
