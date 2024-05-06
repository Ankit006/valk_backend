import express from "express";
import dotenv from "dotenv";
import productRoute from "./routes/products.route.js"
import categoryRoute from "./routes/category.route.js";
import brandsRoute from "./routes/brands.route.js"
import bodyParser from "body-parser";
import cors from "cors"
import path from "path"
import { fileURLToPath } from 'url';


dotenv.config()


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 4000;

app.use(cors({ origin: 'http://localhost:3000' }))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


app.use("/products", productRoute)
app.use("/category", categoryRoute)
app.use("/brands", brandsRoute)

// serve file

app.use('/videos', express.static(path.join(__dirname, 'uploads', 'videos')));
app.use('/audios', express.static(path.join(__dirname, 'uploads', 'audios')));
app.use('/images', express.static(path.join(__dirname, 'uploads', 'images')));
app.listen(port, () => {
    console.log(`Server is running at port ${port}`)
})