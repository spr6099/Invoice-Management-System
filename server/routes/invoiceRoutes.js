// routes/invoiceRoutes.js
import express from "express";
import {varifyToken} from "../middleware/auth.js";
import { createInvoice, getInvoices } from "../controller/invoiceController.js";

const router = express.Router();

router.post("/", varifyToken, createInvoice);
router.get("/", varifyToken, getInvoices);

export default router;
