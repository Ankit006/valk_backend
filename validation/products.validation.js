import { z } from "zod"

export const createProductValidaiton = z.object({
    name: z.string({ message: "Name filed is required" }).min(1),
    slug: z.string().optional(),
    shortDesc: z.string({ message: "short description is required" }).min(1),
    desc: z.string({ message: "description is required" }).min(1),
    weight: z.number({ message: "Weight field is required" }).gte(0),
    height: z.number({ message: "Height field is required" }).gte(0),
    width: z.number({ message: "Width field is required" }).gte(0),
    length: z.number({ message: "Length field is required" }).gte(0),
    price: z.number({ message: "price field is required" }).gte(0),
    brandId: z.number({ message: "brand id is required" }).gte(0),
    totalStock: z.number({ message: "total stock field is requied" }).gte(0),
    tax: z.number({ message: "tax field is required" }).gte(0),
    productCode: z.string({ message: "product code field is required" }).min(1),
})



const specifcationSchema = z.object({
    productId: z.number().gt(0),
    name: z.string().min(1),
    desc: z.string().min(1)
})

export const specificationValidation = z.array(specifcationSchema)