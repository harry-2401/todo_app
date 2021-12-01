require("dotenv").config();
const express = require("express");
const authRouter = require("./routes/auth");
const postsRouter = require("./routes/post")
const app = express();
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://duongvu:1234@cluster0.jkbpj.mongodb.net/Cluster0?retryWrites=true&w=majority"
    );
    console.log("mongoDB connected")
  } catch (error) {
    console.log(error)
  }
};

connectDB()

app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/posts", postsRouter)


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
