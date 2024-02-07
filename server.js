import express from "express";
import browsingRoutes from "./routes/bookBrowsing.js";
import { connectToDatabase } from "./db.js";

const app = express();
app.use(express.json());

connectToDatabase().then(() => {
    app.listen(3000, () => {
        console.log("app listening on port 3000");
    });
});

app.use(browsingRoutes);
