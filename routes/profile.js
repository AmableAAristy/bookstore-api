// Author: Amable Aristy

import express from "express";
import { db } from "../db.js";

const router = express.Router();
router.use(express.json());

//Create a User with username, password and optional fields (name, email address, home address)
router.post("/users", async (req, res) => {
  const { username, password, realName, email, address } = req.body;
  if (!username || !password) {
    return res.status(400).json({
      error: "Username and password are required!",
    });
  }
  //unique username only
  try {
    const uniqueUsername = await db
      .collection("users")
      .findOne({ username: username });
    if (uniqueUsername) {
      return res.status(400).json({
        error: "Unique username already taken",
      });
    }

    const newUser = { username, password };
    if (realName) newUser.realName = realName;
    if (email) newUser.email = email;
    if (address) newUser.address = address;

    const result = await db.collection("users").insertOne(newUser);
    const insertedId = result.insertedId;
    const response = {
      message: "User created successfully",
      insertedId: insertedId,
    };
    res.status(201).json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not create a new user" });
  }
});

//Retrieve a User Object and its fields by their username
router.get("/users", async (req, res) => {
  const username = req.query.username;

  try {
    const foundUser = await db
      .collection("users")
      .findOne({ username: username });
    if (foundUser) {
      res.status(200).json(foundUser);
    } else {
      res.status(404).json({ error: "Username does not exist" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server could not locate usernames." });
  }
});
//Update the user and any of their fields except for mail

router.patch("/users/:username", async (req, res) => {
  const { username } = req.params;
  const { password, realName, email, address, credit } = req.body;

  if (address !== undefined) {
    res.status(400).json({ error: "You cannot update the address." });
  }
  try {
    const updateInformation = {};
    if (password !== undefined) updateInformation.password = password;
    if (realName !== undefined) updateInformation.realName = realName;
    if (email !== undefined) updateInformation.email = email;
    if (credit !== undefined) updateInformation.credit = credit;

    const result = await db
      .collection("users")
      .updateOne({ username: username }, { $set: updateInformation });
    if (result.modifiedCount === 0) {
      return res.status(400).json({ error: "No data was updated" });
    }

    res.status(200).json({ result });
  } catch (err) {
    res.status(500).json({ error: "A server error occured." });
  }
});

// Create Credit Card that belongs to a User

router.get("/", (_, res) => {
  res.send(
    "I just want something to show. I am in profile js you can delete me if you want"
  );
});

export default router;
