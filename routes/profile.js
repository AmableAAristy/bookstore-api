// Author: Amable Aristy

import express from "express";
import { db } from "../db.js";



const router = express.Router();
router.use(express.json())


router.post('/users', async (req, res) => {
    const { username, password, realName, email, address } = req.body;
    if (!username || !password) { //it needs both fields
        return res.status(400).json({
            error: "Username and password are required!"
        });
    }
    try {
        const newUser = { username, password };
        if (realName) newUser.realName = realName;
        if (email) newUser.email = email;
        if (address) newUser.address = address;

        const result = await db.collection('users').insertOne(newUser);
        const insertedId = result.insertedId
        const response = {
            message: "User created successfully",
            insertedId: insertedId
        };
        res.status(201).json(response);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Could not create a new user' });
    }
}
)

router.get('/', (_, res) => {
    res.send('I just want something to show. I am in profile js you can delete me if you want');
});



export default router;