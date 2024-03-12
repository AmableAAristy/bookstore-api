// Author: Maxwell Adelakun
import express from "express";
import { db } from "../db.js";


const router = express.Router();
router.use(express.json())
//This is for the ratings
router.post("/books/ratings", async (req, res) => {
    try {
        const { rating, userId, bookId } = req.body;//gathers rating, userid and bookid from requests

        if ((!rating || !userId, !bookId)) {//check if rating,userid, and bookid are missing
            res.status(400).json({ //sends error if required fields are missing
                error: "Rating, UserId, and BookId are missing in the request.",
            });
            return;
        }

        db.collection("ratings").insertOne({ rating, userId, bookId });//puts rating,userid, and book id in the database collection
            //prints rating being successfully sent
        res.status(200).json({ message: "Rating successfully added to book." });
    } catch (error) {
        // prints error if caught
        console.error(error);
        res.status(500).json({ 
            error: "Internal server error. Please try again later.",
        });
    }
});


// This is for the comments
router.post("/books/comments", async (req, res) => {
    try {
        const { comment, userId, bookId } = req.body;//gathers comments, userid and bookid from requests

        if ((!comment || !userId, !bookId)) {//check if comments,userid, and bookid are missing
            res.status(400).json({ //sends error if required fields are missing
                error: "comment, UserId, and BookId are missing in the request.",
            });
            return;
        }

        db.collection("comment").insertOne({ comment, userId, bookId });//puts comments,userid, and book id in the database collection
            //prints comment being successfully sent
        res.status(200).json({ message: "Comment successfully added to book." });
    } catch (error) {
        // prints error if caught
        console.error(error);
        res.status(500).json({ 
            error: "Internal server error. Please try again later.",
        });
    }
});


export default router;