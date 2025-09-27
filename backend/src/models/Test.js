import { DataTypes } from "sequelize";
import { sequelize } from "../db/db.js";

const Test = sequelize.define(
	"Test",
	{
		id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
		title: { type: DataTypes.TEXT, allowNull: false },
		description: { type: DataTypes.TEXT },
		time_limit: { type: DataTypes.INTEGER },
	},
	{
		tableName: "tests",
		timestamps: true,
		createdAt: "created_at",
		updatedAt: "updated_at",
	}
);

export default Test;
