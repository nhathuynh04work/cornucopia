export const errorMessage = {
	// Auth related
	EXPIRED_TOKEN: "Token expired",
	UNCONFIRMED_USER:
		"Account not verified. Check your email for confirmation link",
	EMAIL_REGISTERED: "Email already registered",

	// Not found
	USER_NOT_FOUND: "User not found",
	TEST_NOT_FOUND: "Test not found",
	SECTION_NOT_FOUND: "Section not found",
	ITEM_NOT_FOUND: "Item not found",
	OPTION_NOT_FOUND: "Option not found",
	MEDIA_NOT_FOUND: "Media not found",
	ATTEMPT_NOT_FOUND: "Attempt not found",

	// Invalid
	INVALID_TOKEN: "Token invalid",
	INVALID_PASSWORD: "Password invalid",
	INVALID_PARAMS: "Request params invalid",
	INVALID_INPUT: "Input failed validation",

	// Missing fields
	MISSING_AUTH_HEADER: "Missing auth header",
	MISSING_TOKEN: "Missing token",

	// Cannot delete last
	DELETE_LAST_ITEM: "Cannot delete last item of a test",
	DELETE_LAST_CHILD: "Cannot delete last item of a group",
	DELETE_LAST_OPTION:
		"Cannot delete last option of a multiple choice question",

	// Default internal server error
	INTERNAL_ERROR: "Internal server error",

	// Other
	MEDIA_ORPHAN: "Media is orphan",
};

export const itemTypeEnum = {
	// question types
	MULTIPLE_CHOICE: "multiple_choice",
	SHORT_ANSWER: "short_answer",

	// structural types
	GROUP: "group",
};

export const mediaLayouts = {
	FULL_WIDTH_STACKED: "FULL_WIDTH_STACKED",
	LEFT_STACKED: "LEFT_STACKED",
	TEXT_TOP_MEDIA_LEFT: "TEXT_TOP_MEDIA_LEFT",
};

export const expireTime = {
	EMAIL_TOKEN: 24 * 60 * 60 * 1000, // 24h
	JWT_TOKEN: "24h",
	S3_UPLOAD_URL: 60 * 5, // 5 minutes
	S3_FETCH_URL: 60 * 5,
};

export const defaults = {
	QUESTION_TEXT: "This is a question",
	OPTION_TEXT: "This is an option",
	POST: {
		title: "Welcome to the Community!",
		excerpt:
			"This is your first post. Use this space to introduce yourself, share language learning tips, or document your progress for others to see.",
		content: `
        <h2>Hello World!</h2>
        <p>Welcome to your personal learning blog. This is a default post created just for you.</p>
        
        <h3>What can you do here?</h3>
        <ul>
            <li><strong>Share Tips:</strong> Help others by sharing what works for you.</li>
            <li><strong>Track Progress:</strong> Write about your daily learning milestones.</li>
            <li><strong>Ask Questions:</strong> Engage with the community.</li>
        </ul>
        
        <p>You can edit or delete this post at any time. Happy learning!</p>
    `,
	},
	MODULE_INFO: {
		title: "New module",
	},
	LESSON_INFO: {
		title: "New lesson",
	},
};
