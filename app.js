require("dotenv").config();
require("./config/database");
const auth = require("./middleware/auth");
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./model/user");
const app = express();

app.use(express.json());

//GET ALL THE USER'S......
app.get("/api/users", async(req, res) => {
    try {
        // Retrieve all users from the database
        const users = await User.find();

        // Return the user data
        res.status(200).json(users);
    } catch (err) {
        console.log(err);
        // res.status(500).send("Internal Server Error");
        res.status(500).json({ error: "Internal Server Error" });
    }
});

//GET USERS BY USERID....
app.get("/api/users/:userId", async(req, res) => {
    try {
        const { userId } = req.params;
        // Find the user in the database by user ID
        const user = await User.findOne({ _id: userId });
        if (!user) {
            // return res.status(404).send("User not found");
            return res.status(404).json({ error: "User not found" });
        }
        // Return the user data
        res.status(200).json(user);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

//This api is for User-SignUp.................
app.post("/api/register", async(req, res) => {
    try {
        // Get user input through request..
        const { first_name, last_name, email, password } = req.body;

        // Validation...
        if (!(email && password && first_name && last_name)) {
            // return res.status(400).send("All input is required");
            return res.status(400).json({ error: "All input is required" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            // return res.status(409).send("User Already Exists. Please Login");

            return res
                .status(409)
                .json({ error: "User Already Exists. Please Login" });
        }
        // Encrypt user password
        const encryptedPassword = await bcrypt.hash(password, 10);

        // Create user in the database
        const user = await User.create({
            first_name,
            last_name,
            email: email.toLowerCase(),
            password: encryptedPassword,
        });

        // Create token
        const token = jwt.sign({ user_id: user._id, email },
            process.env.TOKEN_KEY, { expiresIn: "2h" }
        );

        // Update user with the token and saved into Database...
        user.token = token;
        await user.save();

        // Return new user
        res.status(201).json(user);
    } catch (err) {
        console.log(err);
        // res.status(500).send("Internal Server Error");
        res.status(500).json({ error: "Internal Server Error" });
    }
});

//This api is used for login....
app.post("/api/login", async(req, res) => {
    try {
        // Get user input
        const { email, password } = req.body;

        // Validate user input
        if (!(email && password)) {
            return res.status(400).send("All input is required");
        }

        // Validate if user exists in our database
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            // Create token
            const token = jwt.sign({ user_id: user._id, email },
                process.env.TOKEN_KEY, { expiresIn: "2h" }
            );

            // Return user with the token in the Bearer Token format
            return res.status(200).json({ user, token: `Bearer ${token}` });

            //   return res.status(200).send("message: login Success");
        }

        // res.status(400).send("Invalid Credentials");
        return res.status(400).json({ error: "Invalid Credentials" });
    } catch (err) {
        console.log(err);
        // res.status(500).send("Internal Server Error");
        res.status(500).json({ error: "Internal Server Error" });
    }
});

//By POST token pass logOUt..
/*
app.post("/logout", auth, async(req, res) => {
    try {
        // Get the user from the request object (assuming you have implemented the auth middleware correctly)
        const user = req.user;

        // Clear the token for the user
        user.token = null;

        // Save the updated user in the database
        await user.save();
        res.status(200).send("Logout successful");
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
});
*/
// DELETE USER'S BY  USERID..
app.delete("/api/logout/:userId", async(req, res) => {
    try {
        const userId = req.params.userId;
        // Find the user by user ID
        const user = await User.findById(userId);

        // Check if the user exists
        if (!user) {
            return res.status(404).send("User not found");
        }
        // Invalidate or delete the token associated with the user
        user.token = null; // Assuming the token is stored in the user object or user document

        // Save the updated user object or document
        await user.save();

        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
module.exports = app;