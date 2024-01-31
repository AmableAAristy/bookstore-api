import express from "express";
import browsingRoutes from "./routes/bookBrowsing.js";
import { connectMongoDB } from "./database.js";

const app = express();
app.use(express.json());

connectMongoDB();

app.use(browsingRoutes);

app.listen(3000, () => {
    console.log("app listening on port 3000");
});
