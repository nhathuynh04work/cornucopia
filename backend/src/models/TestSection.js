import { DataTypes } from "sequelize";
import { sequelize } from "../db/db.js";

const TestSection = sequelize.define(
	"TestSection",
	{
		id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
		test_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: { model: "tests", key: "id" },
			onDelete: "CASCADE",
		},
		title: { type: DataTypes.TEXT, allowNull: false },
		sort_order: { type: DataTypes.INTEGER, allowNull: false },
	},
	{
		tableName: "test_sections",
		timestamps: true,
		createdAt: "created_at",
		updatedAt: "updated_at",
	}
);

export default TestSection;
