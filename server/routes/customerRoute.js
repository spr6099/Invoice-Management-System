import express from "express";
import {varifyToken} from "../middleware/auth.js";
import {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
} from "../controller/customerController.js"

const router = express.Router();

router.post("/", varifyToken, createCustomer);
router.get("/", varifyToken, getCustomers);
router.get("/:id", varifyToken, getCustomerById);
router.put("/:id", varifyToken, updateCustomer);
router.delete("/:id", varifyToken, deleteCustomer);

export default router;
