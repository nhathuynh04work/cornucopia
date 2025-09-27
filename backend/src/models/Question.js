import { DataTypes } from "sequelize";
import { sequelize } from "../db/db.js";

const Question = sequelize.define(
	"Question",
	{
		id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
		group_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: { model: "question_groups", key: "id" },
			onDelete: "CASCADE",
		},
		text: { type: DataTypes.TEXT, allowNull: false },
		media_url: { type: DataTypes.TEXT },
		question_type: {
			type: DataTypes.ENUM("multiple_choice", "short_answer"),
			allowNull: false,
		},
		points: { type: DataTypes.DECIMAL(5, 2), defaultValue: 1 },
		sort_order: { type: DataTypes.INTEGER, allowNull: false },
		correct_answer: { type: DataTypes.TEXT },
	},
	{
		tableName: "questions",
		timestamps: true,
		createdAt: "created_at",
		updatedAt: "updated_at",
	}
);

export default Question;
