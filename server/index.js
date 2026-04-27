import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5003;

app.use(cors());

app.get("/", (req, res) => {
  res.send({ message: "healthy!" });
});

app.listen(PORT, () => {
  console.log(`server running on port http://localhost:${PORT}`);
});
