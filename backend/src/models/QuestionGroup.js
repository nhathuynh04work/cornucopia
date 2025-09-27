import { DataTypes } from "sequelize";
import { sequelize } from "../db/db.js";

const QuestionGroup = sequelize.define(
	"QuestionGroup",
	{
		id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
		section_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: { model: "test_sections", key: "id" },
			onDelete: "CASCADE",
		},
		title: { type: DataTypes.TEXT },
		media_url: { type: DataTypes.TEXT },
		sort_order: { type: DataTypes.INTEGER, allowNull: false },
	},
	{
		tableName: "question_groups",
		timestamps: true,
		createdAt: "created_at",
		updatedAt: "updated_at",
	}
);

export default QuestionGroup;
