import express from "express";
import { connectToDatabase } from "./db.js";
import browsingRoutes from "./routes/bookBrowsing.js";// Javier
import profileManagement from "./routes/profile.js"; //Amable
import shoppingCartRoutes from "./routes/shoppingCart.js"; // Brandon
import bookratings from "./routes/bookRating.js"; //Maxwell
import wishList from "./routes/wishList.js";

const app = express();
app.use(express.json());

connectToDatabase().then(() => {
    app.listen(3000, () => {
        console.log("app listening on port 3000");
    });
});

app.use(browsingRoutes);
app.use(profileManagement);
app.use(shoppingCartRoutes);
app.use(bookratings);
app.use(wishList);
