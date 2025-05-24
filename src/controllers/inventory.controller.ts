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

const getAll = async (req: Request, res: Response) => {
	const { page = 1, limit = 10, search, type, condition, room, year } = req.query as unknown as IPaginationQuery;
	try {
		const query = {};
		if (search) {
			Object.assign(query, {
				$or: [{ name: { $regex: search, $options: "i" } }],
			});
		}
		if (type) {
			Object.assign(query, { type });
		}
		if (condition) {
			Object.assign(query, { condition });
		}
		if (room) {
			Object.assign(query, { room });
		}
		if (year) {
			Object.assign(query, { year });
		}
        
		const result = await InventoryModel.find(query)
			.limit(limit)
			.skip((page - 1) * limit)
			.sort({ createdAt: -1 })
			.exec();

		const count = await InventoryModel.countDocuments(query);
		response.pagination(
			res,
			result,
			{
				total: count,
				totalPages: Math.ceil(count / limit),
				current: page,
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
