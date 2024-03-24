import express from "express";
import browsingRoutes from "./routes/bookBrowsing.js";
import { connectToDatabase } from "./db.js";
import profileManagement from "./routes/profile.js"; //Amable
import bookDetails from "./routes/bookDetails.js"; //Tarah added this

const app = express();
app.use(express.json());

connectToDatabase().then(() => {
    app.listen(3000, () => {
        console.log("app listening on port 3000");
    });
});

app.use(browsingRoutes);
app.use(profileManagement);
app.use(bookDetails);//Tarah added this
