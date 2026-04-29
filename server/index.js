import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/user.js";
import productRoutes from "./routes/product.js";

connectDB();

const app = express();
const PORT = process.env.PORT || 5003;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send({ message: "healthy!" });
});
app.use("/api/", authRoutes);
app.use("/api/products", productRoutes);

app.listen(PORT, () => {
  console.log(`server running on port http://localhost:${PORT}`);
});
