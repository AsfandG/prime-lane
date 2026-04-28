import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/user.js";
dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5003;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send({ message: "healthy!" });
});
app.use("api/user", authRoutes);

app.listen(PORT, () => {
  console.log(`server running on port http://localhost:${PORT}`);
});
