// Author: Maxwell Adelakun
import express from "express";
import { db } from "../db.js";
import { ObjectId } from "mongodb";

const router = express.Router();
router.use(express.json());

//Endpoint to retrieve comments for a particular book
router.get("/books/comments/:bookId", async (req, res) => {
    try {
        const { bookId } = req.params;

        const comments = await db
            .collection("comments")
            .find({ bookId })
            .toArray();

        res.status(200).json(comments);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Internal server error. Please try again later.",
        });
    }
});

//Endpoint to calculate the average rating for a particular book
router.get("/books/average-rating/:bookId", async (req, res) => {
    try {
        const { bookId } = req.params;

        const ratings = await db
            .collection("ratings")
            .find({ bookId })
            .toArray();

        if (ratings.length === 0) {
            res.status(404).json({
                error: "No ratings found for the specified book.",
            });
            return;
        }

        const totalRating = ratings.reduce((acc, cur) => acc + cur.rating, 0);
        const averageRating = totalRating / ratings.length;

        res.status(200).json({ averageRating });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Internal server error. Please try again later.",
        });
    }
});

//Endpoint to add a rating for a book
router.post("/books/ratings", async (req, res) => {
    try {
        const { rating, userId, bookId } = req.body;

        if ((!rating || !userId, !bookId)) {
            res.status(400).json({
                error: "Rating, UserId, and BookId are missing in the request.",
            });
            return;
        }

        db.collection("ratings").insertOne({
            rating,
            userId: new ObjectId(userId),
            bookId: new ObjectId(bookId),
        });

        res.status(200).json({ message: "Rating successfully added to book." });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Internal server error. Please try again later.",
        });
    }
});

//Endpoint to add a comment for a book
router.post("/books/comment", async (req, res) => {
    try {
        const { comment, userId, bookId } = req.body;

        if (!comment || !userId || !bookId) {
            res.status(400).json({
                error: "Comment, UserId, and BookId are missing in the request.",
            });
            return;
        }

        db.collection("comments").insertOne({ comment, userId, bookId });

        res.status(200).json({
            message: "Comment successfully added to book.",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Internal server error. Please try again later.",
        });
    }
});

export default router;
