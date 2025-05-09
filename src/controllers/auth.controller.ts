import { Request, Response } from "express";
import UserModel from "../models/user.model";
import { encrypt } from "../utils/encryption";
import { generateToken } from "../utils/jwt";
import { IReqUser } from "../utils/interface";
import response from "../utils/response";
import { userDTO, userLoginDTO, userUpdatePasswordDTO } from "../validations/user.validation";

const updateProfile = async (req: IReqUser, res: Response) => {
	try {
		const userId = req.user?.id;
		const { fullname, profilePicture } = req.body;
		const result = await UserModel.findByIdAndUpdate(userId, { fullname, profilePicture }, { new: true });
		if (!result) {
			return response.notFound(res, "user not found");
		}
		response.success(res, result, "success update profile user");
	} catch (error) {
		response.error(res, error, "failed update profile user");
	}
};

const updatePassword = async (req: IReqUser, res: Response) => {
	try {
		const userId = req.user?.id;
		const { oldPassword, password, confirmPassword } = req.body;
		await userUpdatePasswordDTO.validate({ oldPassword, password, confirmPassword });
		const user = await UserModel.findById(userId);
		if (!user || user.password !== encrypt(oldPassword)) {
			return response.notFound(res, "user not found");
		}
		const result = await UserModel.findByIdAndUpdate(userId, { password: encrypt(password) }, { new: true });
		response.success(res, result, "success update password user");
	} catch (error) {
		response.error(res, error, "failed update password user");
	}
};

const me = async (req: IReqUser, res: Response) => {
	try {
		const user = req.user;
		const result = await UserModel.findById(user?.id);
		response.success(res, result, "success get user data");
	} catch (error) {
		response.error(res, error, "failed get user data");
	}
};

const register = async (req: Request, res: Response) => {
	try {
		await userDTO.validate(req.body);
		const { fullname, username, email, password, confirmPassword } = req.body;
		const result = await UserModel.create({
			fullname,
			username,
			email,
			password,
			confirmPassword,
			isActive: true,
		});
		response.success(res, result, "success register user");
	} catch (error) {
		response.error(res, error, "failed register user");
	}
};

const login = async (req: Request, res: Response) => {
	try {
		const { identifier, password } = req.body;
		await userLoginDTO.validate({ identifier, password });
		// ambil data user berdasarkan "identifier" -> email / username
		const userByIdentifier = await UserModel.findOne({
			$or: [{ email: identifier }, { username: identifier }],
			isActive: true,
		});

		if (!userByIdentifier) {
			return response.unauthorized(res, "user not found");
		}

		// validasi password
		const validatePassword: boolean = encrypt(password) === userByIdentifier?.password;

		if (!validatePassword) {
			return response.unauthorized(res, "password not match");
		}

		const token = generateToken({
			id: userByIdentifier._id,
			role: userByIdentifier.role,
		});

		response.success(res, token, "success login");
	} catch (error) {
		console.error("Error during login:", error);
		response.error(res, error, "failed login");
	}
};

export { updateProfile, updatePassword, me, register, login };
