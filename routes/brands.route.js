import express from "express";
import db from "../database/dbClient.js";
import { eq } from "drizzle-orm";
import { brand } from "../database/schema.js";
import httpStatus from "http-status";

const route = express.Router();

route.get("/", async (req, res) => {
    try {
        const { categoryId } = req.query;
        if (!categoryId) {
            const list = await db.query.brand.findMany();
            return res.send(list)
        } else {
            const list = await db.query.brand.findMany({
                where: eq(brand.categoryId, parseInt(categoryId))
            })
            return res.send(list)
        }
    } catch {
        return res
            .status(httpStatus.INTERNAL_SERVER_ERROR)
            .json({ message: "There is an issue in server" });
    }
})

export default route;