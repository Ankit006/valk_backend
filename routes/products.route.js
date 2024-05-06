import express from "express";
import httpstatus from "http-status";
import slug from "slug";
import { v4 as uuid } from "uuid";
import db from "../database/dbClient.js";
import { asset, inventory, product, specification } from "../database/schema.js";
import { multerUpload } from "../utils/multerDisk.js";
import { createProductValidaiton, specificationValidation } from "../validation/products.validation.js";
import { eq } from "drizzle-orm";

const route = express.Router();

////// All products with brand and inventory
route.get("/", async (_req, res) => {
    try {
        const allProducts = await db.query.product.findMany({
            with: {
                brand: {
                    with: {
                        category: true
                    }
                },
                inventory: true,
                assets: true
            },
        });
        return res.send(allProducts);
    } catch {
        return res
            .status(httpstatus.INTERNAL_SERVER_ERROR)
            .json({ message: "There is an issue in server" });
    }
});


route.get("/:parentId", async (req, res) => {
    try {
        const list = await db.query.product.findFirst({
            where: eq(product.id, req.params.parentId),
            with: {
                brand: {
                    with: {
                        category: {
                            with: {
                                parent: {
                                    with: {
                                        parent: true
                                    }
                                }
                            }
                        }


                    }
                },
                inventory: true,
                assets: true
            },
        })
        return res.send(list)
    } catch {
        return res
            .status(httpstatus.INTERNAL_SERVER_ERROR)
            .json({ message: "There is an issue in server" });
    }
})


//////// add a new product

route.post("/", async (req, res) => {
    // validated user input
    const parsedValue = createProductValidaiton.safeParse(req.body);
    if (!parsedValue.success) {
        return res
            .status(httpstatus.UNPROCESSABLE_ENTITY)
            .send(parsedValue.error.flatten().fieldErrors);
    }

    // separate inventory data and product data
    const { totalStock, tax, productCode, ...productFields } = parsedValue.data;
    const inventoryData = {
        totalStock,
        tax,
        productCode,
    };

    // check if product fields contain slug. If not then generate new slug
    if (!productFields.slug || productFields.slug === "") {
        productFields.slug = `${slug(productFields.name, "_")}_${uuid()}`;
    }

    try {

        // insert product data
        const productRes = await db
            .insert(product)
            .values(productFields)
            .returning();

        // insert inventory data    
        const productData = productRes[0]
        await db
            .insert(inventory)
            .values({ productId: productData.id, ...inventoryData });
        return res.status(httpstatus.CREATED).send(productData)
    } catch (err) {
        return res
            .status(httpstatus.INTERNAL_SERVER_ERROR)
            .json({ message: "There is an issue in server" });
    }
});


/// add assets for products

route.post("/assets/:productId", multerUpload, async (req, res) => {
    try {
        const files = [];
        Object.keys(req.files).forEach(fieldname => {
            const fieldFiles = req.files[fieldname].map(file => {
                return {
                    productId: parseInt(req.params["productId"]),
                    type: fieldname,
                    path: file.path
                }
            })
            files.push(...fieldFiles)
        })
        await db.insert(asset).values(files);
        return res.status(201).json({ message: "files uploaded" })
    } catch (err) {
        return res
            .status(httpstatus.INTERNAL_SERVER_ERROR)
            .json({ message: "There is an issue in server" });
    }

})


// add specification
route.post("/specification/:productId", async (req, res) => {
    const parsedData = specificationValidation.safeParse(req.body);
    if (!parsedData.success) {
        return res
            .status(httpstatus.UNPROCESSABLE_ENTITY)
            .send(parsedData.error);
    }
    const specificationData = parsedData.data;
    try {
        await db.insert(specification).values(specificationData);
        return res.send({ message: "specification added" })
    } catch {
        return res
            .status(httpstatus.INTERNAL_SERVER_ERROR)
            .json({ message: "There is an issue in server" });
    }
})


export default route;
