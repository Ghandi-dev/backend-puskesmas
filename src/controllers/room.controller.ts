import { Request, Response } from "express";
import { IPaginationQuery, IReqUser } from "../utils/interface";
import response from "../utils/response";
import RoomModel from "../models/room.models";
import { roomSchema } from "../validations/room.validation";

const create = async (req: IReqUser, res: Response) => {
	try {
		const room = req.body;
		const userId = req.user?.id;
		room.createdBy = userId;
		room.updatedBy = userId;
		roomSchema.validateSync(room);
		const result = await RoomModel.create(room);
		response.success(res, result, "success create room");
	} catch (error) {
		response.error(res, error, "failed create room");
	}
};

const getAll = async (req: Request, res: Response) => {
	try {
		const { page = 1, limit = 10, search } = req.query as unknown as IPaginationQuery;
		const query: any = {};
		if (search) {
			Object.assign(query, { $or: [{ name: { $regex: search, $options: "i" } }] });
		}
		const result = await RoomModel.find(query)
			.skip((page - 1) * limit)
			.limit(limit)
			.populate("createdBy", "fullname")
			.populate("updatedBy", "fullname")
			.sort({ createdAt: -1 });
		const total = await RoomModel.countDocuments(query);
		const totalPages = Math.ceil(total / limit);
		const pagination = { totalPages, current: page, total };
		response.pagination(res, result, pagination, "success get all room");
	} catch (error) {
		response.error(res, error, "failed get all room");
	}
};

const getById = async (req: Request, res: Response) => {
	try {
		const id = req.params.id;
		const result = await RoomModel.findById(id).populate("createdBy", "fullname").populate("updatedBy", "fullname");
		if (!result) return response.notFound(res, "room not found");
		response.success(res, result, "success get room by id");
	} catch (error) {
		response.error(res, error, "failed get room by id");
	}
};

const update = async (req: IReqUser, res: Response) => {
	try {
		const id = req.params.id;
		const roomData = req.body;
		const userId = req.user?.id;
		roomData.updatedBy = userId;
		const result = await RoomModel.findByIdAndUpdate(id, roomData, { new: true });
		if (!result) return response.notFound(res, "room not found");
		response.success(res, result, "success update room");
	} catch (error) {
		response.error(res, error, "failed update room");
	}
};

const remove = async (req: Request, res: Response) => {
	try {
		const id = req.params.id;
		const result = await RoomModel.findByIdAndDelete(id);
		response.success(res, result, "success delete room");
	} catch (error) {
		response.error(res, error, "failed delete room");
	}
};

export { create, getAll, remove, update, getById };
