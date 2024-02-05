import express from "express";
import browsingRoutes from "./routes/bookBrowsing.js";
import shoppingCartRoutes from "./routes/shoppingCart.js";
import { connectMongoDB } from "./database.js";

const app = express();
app.use(express.json());

connectMongoDB();
//**ADD YOUR ROUTES HERE**/
app.use(browsingRoutes);
app.use(shoppingCartRoutes);
app.listen(3000, () => {
    console.log("app listening on port 3000");
});