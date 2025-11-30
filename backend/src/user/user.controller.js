import { userService } from "./user.service.js";

const getUsers = async (req, res) => {
	const result = await userService.getUsers(req.query);
	res.status(200).json(result);
};

const getLandingData = async (req, res) => {
	const data = await userService.getLandingData();
	res.status(200).json({ data });
};

const getLibrary = async (req, res) => {
	const userId = req.user.id;
	const data = await userService.getLibraryData(userId);
	res.status(200).json(data);
};

const updateUser = async (req, res) => {
	const userId = req.params.id;
	const body = req.body;

	const user = await userService.updateUser(userId, body);
	res.status(200).json({ user });
};

export const userController = {
	getUsers,
	getLandingData,
	getLibrary,
	updateUser,
};
