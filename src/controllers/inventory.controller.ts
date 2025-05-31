import { Request, Response } from "express";
import { IPaginationQuery, IReqUser } from "../utils/interface";
import response from "../utils/response";
import InventoryModel from "../models/inventory.model";
import { inventorySchema } from "../validations/inventory.validation";

const create = async (req: IReqUser, res: Response) => {
	try {
		const inventory = req.body;
		await inventorySchema.validate(inventory);
		const result = await InventoryModel.create(inventory);

		response.success(res, result, "success create inventory");
	} catch (error) {
		response.error(res, error, "failed create inventory");
	}
};

const parseQueryArray = (value?: string | string[]) => {
	if (!value) return undefined;
	if (Array.isArray(value)) return value;
	if (typeof value === "string" && value.includes(",")) {
		return value.split(",");
	}
	return value;
};

const getAll = async (req: Request, res: Response) => {
	const { page = 1, limit = 10, search, type, condition, room, startYear, endYear } = req.query as unknown as IPaginationQuery;

	try {
		const query: any = {};

		if (search) {
			Object.assign(query, { $or: [{ name: { $regex: search, $options: "i" } }] });
		}

		const parsedType = parseQueryArray(type);
		if (parsedType) {
			if (Array.isArray(parsedType)) {
				Object.assign(query, { type: { $in: parsedType } });
			} else {
				Object.assign(query, { type: parsedType });
			}
		}

		const parsedCondition = parseQueryArray(condition);
		if (parsedCondition) {
			if (Array.isArray(parsedCondition)) {
				Object.assign(query, { condition: { $in: parsedCondition } });
			} else {
				Object.assign(query, { condition: parsedCondition });
			}
		}

		const parsedRoom = parseQueryArray(room);
		if (parsedRoom) {
			if (Array.isArray(parsedRoom)) {
				Object.assign(query, { room: { $in: parsedRoom } });
			} else {
				Object.assign(query, { room: parsedRoom });
			}
		}
		const yearFilter: Record<string, number> = {};
		if (startYear) {
			yearFilter.$gte = Number(startYear);
		}
		if (endYear) {
			yearFilter.$lte = Number(endYear);
		}
		if (Object.keys(yearFilter).length > 0) {
			Object.assign(query, { year: yearFilter });
		}

		const result = await InventoryModel.find(query)
			.limit(Number(limit))
			.skip((Number(page) - 1) * Number(limit))
			.sort({ createdAt: -1 })
			.exec();

		const count = await InventoryModel.countDocuments(query);

		response.pagination(
			res,
			result,
			{
				total: count,
				totalPages: Math.ceil(count / Number(limit)),
				current: Number(page),
			},
			"success get all inventory"
		);
	} catch (error) {
		response.error(res, error, "failed to get all inventory");
	}
};

const getById = async (req: Request, res: Response) => {
	try {
		const id = req.params.id;
		const result = await InventoryModel.findById(id);
		if (!result) return response.notFound(res, "inventory not found");
		response.success(res, result, "success get inventory");
	} catch (error) {
		response.error(res, error, "failed get inventory");
	}
};

const remove = async (req: Request, res: Response) => {
	try {
		const id = req.params.id;
		const result = await InventoryModel.findByIdAndDelete(id);
		if (!result) return response.notFound(res, "inventory not found");
		response.success(res, result, "success delete inventory");
	} catch (error) {
		response.error(res, error, "failed delete inventory");
	}
};

const update = async (req: Request, res: Response) => {
	try {
		const id = req.params.id;
		const inventory = req.body;
		const result = await InventoryModel.findByIdAndUpdate(id, inventory, { new: true });
		if (!result) return response.notFound(res, "inventory not found");
		response.success(res, result, "success update inventory");
	} catch (error) {
		response.error(res, error, "failed update inventory");
	}
};

export { create, getAll, getById, remove, update };
