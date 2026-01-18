import express from "express";
import {varifyToken} from "../middleware/auth.js";
import {
  createItem,
  getItems,
  getItemById,
  updateItem,
  deleteItem,
} from "../controller/itemController.js";

const router = express.Router();

router.post("/", varifyToken, createItem);
router.get("/", varifyToken, getItems);
router.get("/:id", varifyToken, getItemById);
router.put("/:id", varifyToken, updateItem);
router.delete("/:id", varifyToken, deleteItem);

export default router;
    