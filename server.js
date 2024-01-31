import express from "express";
import browsingRoutes from "./routes/bookBrowsing.js";

const app = express();
app.use(express.json());

app.use(browsingRoutes);

app.listen(3000, () => {
    console.log("app listening on port 3000");
});
