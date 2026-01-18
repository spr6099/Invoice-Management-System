import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import db from "./config/db.js";
import authRouter from "./routes/authRoutes.js";
import customerRouter from "./routes/customerRoute.js";
import itemRouter from "./routes/itemRoutes.js";
import invoiceRouter from "./routes/invoiceRoutes.js";

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
// app.use(cors());
app.use(cors({
  origin: [
    "http://localhost:5173",          // local Vite
    "http://localhost:3000",          // local CRA
    "https://your-frontend.onrender.com" // production frontend
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));
db();

app.use("/api/user", authRouter);
app.use("/api/customer", customerRouter);
app.use("/api/items", itemRouter);
app.use("/api/invoices", invoiceRouter);

app.get("/", (req, res) => {
  res.send("backend connected");
});

app.listen(PORT, () => console.log(`port connected on ${PORT}`));
