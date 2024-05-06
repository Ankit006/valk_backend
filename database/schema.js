import { relations } from "drizzle-orm";
import {
    integer,
    pgEnum,
    pgTable,
    serial,
    text,
    varchar,
    timestamp
} from "drizzle-orm/pg-core";

/////////////// product
export const product = pgTable("product", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    shortDesc: text("short_desc").notNull(),
    desc: text("desc").notNull(),
    weight: integer("weight").notNull(),
    height: integer("height").notNull(),
    width: integer("width").notNull(),
    length: integer("length").notNull(),
    price: integer("price").notNull(),
    brandId: integer("brand_id").references(() => brand.id).notNull(),
    createdAt: timestamp('created_at').defaultNow(),
});

export const productRelations = relations(product, ({ many, one }) => ({
    specifications: many(specification),
    inventory: one(inventory, {
        fields: [product.id],
        references: [inventory.productId],
    }),
    assets: many(asset),
    brand: one(brand, {
        fields: [product.brandId],
        references: [brand.id]
    })
}));

///////////////////////// product specification
export const specification = pgTable("specification", {
    id: serial("id").primaryKey(),
    productId: integer("product_id")
        .references(() => product.id, {
            onDelete: "cascade",
        })
        .notNull(),
    name: text("name").notNull(),
    desc: text("desc").notNull(),
    createdAt: timestamp('created_at').defaultNow(),

});

export const specificationRelations = relations(specification, ({ one }) => ({
    product: one(product, {
        fields: [specification.productId],
        references: [product.id],
    }),
}));

//////////////// brand

export const brand = pgTable("brand", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    categoryId: integer("category_id").references(() => category.id).notNull(),
    createdAt: timestamp('created_at').defaultNow(),

})

export const brandRelation = relations(brand, ({ one, many }) => ({
    products: many(product),
    category: one(category, {
        fields: [brand.categoryId],
        references: [category.id]
    })
}))

///////////////// inventory

export const inventory = pgTable("inventory", {
    id: serial("id").primaryKey(),
    productId: integer("product_id")
        .references(() => product.id, {
            onDelete: "cascade",
        })
        .notNull(),
    totalStock: integer("total_stock").notNull(),
    tax: integer("tax").notNull(),
    productCode: text("product_code").notNull(),
    createdAt: timestamp('created_at').defaultNow(),

});

export const inventoryRelation = relations(inventory, ({ one }) => ({
    product: one(product, {
        fields: [inventory.productId],
        references: [product.id],
    }),
}));

//////// asset

export const assetType = pgEnum("assetType", ["image", "audio", "video"]);

export const asset = pgTable("asset", {
    id: serial("id").primaryKey(),
    productId: integer("product_id")
        .references(() => product.id, {
            onDelete: "cascade",
        })
        .notNull(),
    type: assetType("type").notNull(),
    path: text("path"),
    createdAt: timestamp('created_at').defaultNow(),

});

export const assetRelations = relations(asset, ({ one }) => ({
    product: one(product, {
        fields: [asset.productId],
        references: [product.id],
    }),
}));

///////////// category

export const categoryType = pgEnum("category_type", [
    "category",
    "sub_category",
    "child_category",
]);

export const category = pgTable("category", {
    id: integer("id").primaryKey(),
    name: text("name").notNull(),
    type: categoryType("type").notNull(),
    parentId: integer("parent_id").references(() => category.id),
    createdAt: timestamp('created_at').defaultNow(),

});

export const categoryRelations = relations(category, ({ one }) => ({
    parent: one(category, {
        fields: [category.parentId],
        references: [category.id],
    }),
    children: one(category, {
        fields: [category.id],
        references: [category.parentId],
    }),
}));
