// Author: Javier Garcia
import express from "express";
import { db } from "../db.js";

const router = express.Router();

// Retrieve List of Books by Genre (http://localhost:3000/books/browse/by-genre?genre=mystery)
router.get("/books/browse/by-genre", async (req, res) => {
    try {
        const genre = req.query.genre;

        if (!genre) {
            res.status(400).json({
                error: "Genre parameter is missing in the request.",
            });
            return;
        }

        const regex = new RegExp(genre, "i");

        const books = await db
            .collection("books")
            .find({ genre: regex })
            .toArray();

        res.status(200).json(books);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Internal server error. Please try again later.",
        });
    }
});

// Retrieve List of Top Sellers (http://localhost:3000/books/browse/top-sellers)
router.get("/books/browse/top-sellers", async (req, res) => {
    try {
        const books = await db
            .collection("books")
            .find()
            .sort({ copiesSold: -1 })
            .limit(10)
            .toArray();

        res.status(200).json(books);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Internal server error. Please try again later.",
        });
    }
});

// Retrieve List of Books for a particular rating and higher (http://localhost:3000/books/browse/by-rating?rating=5)
router.get("/books/browse/by-rating", (req, res) => {
    const rating = req.query.rating;
});

// Discount books by publisher (http://localhost:3000/books/discount-by-publisher)
router.patch("/books", (req, res) => {
    const { publisher, discountPercent } = req.body;
});

export default router;
