import { sequelize } from "../db/db.js";

import User from "./User.js";
import Authentication from "./Authentication.js";
import UserRole from "./UserRole.js";
import EmailVerificationToken from "./EmailVerificationToken.js";
import Media from "./Media.js";
import Test from "./Test.js";
import TestSection from "./TestSection.js";
import QuestionGroup from "./QuestionGroup.js";
import Question from "./Question.js";
import AnswerOption from "./AnswerOption.js";

// --- User relationships ---
User.hasMany(Authentication, { foreignKey: "user_id" });
Authentication.belongsTo(User, { foreignKey: "user_id" });

User.hasOne(UserRole, { foreignKey: "user_id", onDelete: "CASCADE" });
UserRole.belongsTo(User, { foreignKey: "user_id" });

User.hasOne(EmailVerificationToken, {
	foreignKey: "user_id",
	onDelete: "CASCADE",
});
EmailVerificationToken.belongsTo(User, { foreignKey: "user_id" });

User.hasMany(Media, { foreignKey: "user_id" });
Media.belongsTo(User, { foreignKey: "user_id" });

// --- Test hierarchy ---
Test.hasMany(TestSection, { foreignKey: "test_id" });
TestSection.belongsTo(Test, { foreignKey: "test_id" });

TestSection.hasMany(QuestionGroup, { foreignKey: "section_id" });
QuestionGroup.belongsTo(TestSection, { foreignKey: "section_id" });

QuestionGroup.hasMany(Question, { foreignKey: "group_id" });
Question.belongsTo(QuestionGroup, { foreignKey: "group_id" });

Question.hasMany(AnswerOption, { foreignKey: "question_id" });
AnswerOption.belongsTo(Question, { foreignKey: "question_id" });

export {
	sequelize,
	User,
	Authentication,
	UserRole,
	EmailVerificationToken,
	Media,
	Test,
	TestSection,
	QuestionGroup,
	Question,
	AnswerOption,
};
