import { userService } from "./user.service.js";

const getUsers = async (req, res) => {
	const result = await userService.getUsers(req.query);
	res.status(200).json(result);
};

const getLandingData = async (req, res) => {
	const data = await userService.getLandingData();
	res.status(200).json({ data });
};

const getUserProfile = async (req, res) => {
	const { id } = req.params;
	const currentUserId = req.user?.id;

	if (id === currentUserId) {
		const data = await userService.getLibraryData(currentUserId);
		return res.status(200).json(data);
	}

	const data = await userService.getPublicProfile(id);
	res.status(200).json(data);
};

const updateMyProfile = async (req, res) => {
	const userId = req.user.id;
	const body = req.body;
	const user = await userService.updateSelf(userId, body);
	res.status(200).json({ user });
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
	getUserProfile,
	updateUser,
	updateMyProfile,
};
