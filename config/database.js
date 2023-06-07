const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/myAuth", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", (error) => {
    console.error("Database connection error:", error);
});

db.once("open", () => {

    // console.log("Successfully connected to the database");


    // Start your application logic here
});