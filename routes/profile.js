// Author: Amable Aristy

import express from "express";
import { db } from "../db.js";



const router = express.Router();
router.use(express.json())


router.post('/users', (req, res) => {
    const { username, password, realName, email, address } = req.body;
    if (!username || !password) { //it needs both fields
        return res.status(400).json({
            error: "Username and password are required!"
        });
    }
    
    if (username && password) {
        const newUser = { username, password };
        if (realName) newUser.realName = realName;
        if (email) newUser.email = email;
        if (address) newUser.address = address;


        db.collection('users')
            .insertOne(newUser)
            .then(result => {
                res.status(201).json(result)
            })
            .catch(err => {
                res.status(500).json({ err: 'Could not create a new user' })
            })
    }
})

router.get('/', (_, res) => {
    res.send('I just want something to show. I am in profile js you can delete me if you want');
});



export default router;