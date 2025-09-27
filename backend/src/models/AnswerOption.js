import { DataTypes } from "sequelize";
import { sequelize } from "../db/db.js";

const AnswerOption = sequelize.define(
	"AnswerOption",
	{
		id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
		question_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: { model: "questions", key: "id" },
			onDelete: "CASCADE",
		},
		text: { type: DataTypes.TEXT, allowNull: false },
		is_correct: { type: DataTypes.BOOLEAN, defaultValue: false },
		sort_order: { type: DataTypes.INTEGER, allowNull: false },
	},
	{
		tableName: "answer_options",
		timestamps: true,
		createdAt: "created_at",
		updatedAt: "updated_at",
	}
);

export default AnswerOption;
