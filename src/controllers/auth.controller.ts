import { Request, Response } from "express";
import UserModel from "../models/user.model";
import { encrypt } from "../utils/encryption";
import { generateToken } from "../utils/jwt";
import { IPaginationQuery, IReqUser } from "../utils/interface";
import response from "../utils/response";
import { userDTO, userLoginDTO, userUpdatePasswordDTO } from "../validations/user.validation";
import { ROLES } from "../utils/constant";

const updateProfile = async (req: IReqUser, res: Response) => {
	try {
		const userId = req.user?.id;
		const { fullname, email, profilePicture } = req.body;
		const result = await UserModel.findByIdAndUpdate(userId, { fullname, profilePicture, email }, { new: true });
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
		const { oldPassword, password, passwordConfirm } = req.body;
		await userUpdatePasswordDTO.validate({ oldPassword, password, passwordConfirm });
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
		response.error(res, error, "failed login");
	}
};

const getAll = async (req: IReqUser, res: Response) => {
	try {
		const { page = 1, limit = 10, search } = req.query as unknown as IPaginationQuery;
		const userId = req.user?.id;

		const query: any = {
			_id: { $ne: userId }, // exclude current user
		};

		if (search) {
			query.$or = [
				{ fullname: { $regex: search, $options: "i" } },
				{ email: { $regex: search, $options: "i" } },
				{ username: { $regex: search, $options: "i" } },
			];
		}

		const result = await UserModel.find(query)
			.limit(Number(limit))
			.skip((Number(page) - 1) * Number(limit))
			.sort({ createdAt: -1 })
			.exec();

		const count = await UserModel.countDocuments(query);

		response.pagination(
			res,
			result,
			{
				total: count,
				totalPages: Math.ceil(count / Number(limit)),
				current: Number(page),
			},
			"success get all user"
		);
	} catch (error) {
		response.error(res, error, "failed get all user");
	}
};

const updateRole = async (req: IReqUser, res: Response) => {
	try {
		const userId = req.params.id;

		// Ambil user terlebih dahulu
		const user = await UserModel.findById(userId);
		if (!user) {
			return response.notFound(res, "user not found");
		}
		if (user.username === "superadmin") {
			return response.unauthorized(res, "cannot update role superadmin");
		}

		// Toggle role dengan ternary
		const newRole = user.role === ROLES.ADMIN ? ROLES.SUPERADMIN : ROLES.ADMIN;

		const result = await UserModel.findByIdAndUpdate(userId, { role: newRole }, { new: true });

		response.success(res, result, "success update role user");
	} catch (error) {
		response.error(res, error, "failed update role user");
	}
};

const deleteUser = async (req: IReqUser, res: Response) => {
	try {
		const userId = req.params.id;
		const result = await UserModel.findByIdAndDelete(userId);
		if (!result) {
			return response.notFound(res, "user not found");
		}
		response.success(res, result, "success delete user");
	} catch (error) {
		response.error(res, error, "failed delete user");
	}
};

export { updateProfile, updatePassword, me, register, login, updateRole, deleteUser, getAll };
