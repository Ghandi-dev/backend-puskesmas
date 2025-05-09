import { Request, Response } from "express";
import { IReqUser } from "../utils/interface";
import response from "../utils/response";
import RoomModel from "../models/room.models";

const create = async (req: IReqUser, res: Response) => {
	try {
		const room = req.body;
		const result = await RoomModel.create(room);
		response.success(res, result, "success create room");
	} catch (error) {
		response.error(res, error, "failed create room");
	}
};

const getAll = async (req: Request, res: Response) => {
	try {
		const result = await RoomModel.find({});
		response.success(res, result, "success get all room");
	} catch (error) {
		response.error(res, error, "failed get all room");
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

export { create, getAll, remove };
