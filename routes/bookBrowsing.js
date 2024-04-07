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
router.get("/books/browse/by-rating", async (req, res) => {
    try {
        const rating = req.query.rating;

        if (!rating) {
            res.status(400).json({
                error: "Rating parameter is missing in the request.",
            });
            return;
        }

        const ratings = await db
            .collection("ratings")
            .find({ rating: { $gte: Number.parseInt(rating, 10) } })
            .toArray();

        const bookIds = ratings.map(rating => rating.bookId);

        const books = await db
            .collection("books")
            .find({ _id: { $in: bookIds } })
            .toArray();

        res.status(200).json(books);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Internal server error. Please try again later.",
        });
    }
});

// Discount books by publisher (http://localhost:3000/books/discount-by-publisher)
router.patch("/books/discount", async (req, res) => {
    try {
        const { publisher, discountPercent } = req.body;

        if (!publisher || !discountPercent) {
            res.status(400).json({
                error: "Publisher and discount percent fields missing in request body.",
            });
            return;
        }

        const booksToUpdate = await db
            .collection("books")
            .find({ publisher })
            .toArray();

        const updatedBooks = booksToUpdate.map(book => {
            const discountedPrice = parseFloat(
                (book.price * (1 - discountPercent / 100)).toFixed(2)
            );
            return {
                ...book,
                price: discountedPrice,
            };
        });

        await Promise.all(
            updatedBooks.map(book =>
                db
                    .collection("books")
                    .updateOne(
                        { _id: book._id },
                        { $set: { price: book.price } }
                    )
            )
        );

        res.status(200).json({ message: "Books discounted successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Internal server error. Please try again later.",
        });
    }
});

export default router;
