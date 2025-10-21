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

  // Invalid
  INVALID_TOKEN: "Token invalid",
  INVALID_PASSWORD: "Password invalid",
  INVALID_PARAMS: "Request params invalid",
  INVALID_INPUT: "Input failed validation",

  // Missing fields
  MISSING_AUTH_HEADER: "Missing auth header",
  MISSING_TOKEN: "Missing token",

  // Default internal server error
  INTERNAL_ERROR: "Internal server error",
};

export const providers = {
  local: "local",
  google: "google",
};

export const testItemTypes = {
  QUESTION: "question",
  GROUP: "group",
};

export const questionTypes = {
  MULTIPLE_CHOICE: "multiple_choice",
  SHORT_ANSWER: "short_answer",
};

export const expireTime = {
  EMAIL_TOKEN: 24 * 60 * 60 * 1000, // 24h
  JWT_TOKEN: "24h",
};

export const defaultPost = {
  title: "Bài viết mặc định",
  content: "<p>Nội dung mặc định</p>",
  status: "draft",
};
