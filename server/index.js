const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoute = require("./Routes/userRoute");
const chatRoute = require("./Routes/chatRoute");

const app = express();
require("dotenv").config();

app.use(express.json());
app.use(cors()); // middleware
app.use("/api/users", userRoute);
app.use("/api/chats", chatRoute);


// CRUD
app.get("/", (req, res) => {
    res.send("Hello World!");
});


const port = process.env.PORT || 3500;
const uri = process.env.ATLAS_URL;


app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
})
// Connect to MongoDB
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB Connected...");
  })
  .catch((err) => console.log("MongoDB connection failed :", err.message));
