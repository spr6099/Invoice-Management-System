import Item from "../models/itemModel.js";

/* ================= CREATE ITEM ================= */
export const createItem = async (req, res) => {
  try {
    const { name, price, stock } = req.body;
    // console.log(name, price, stock)

    if (!name || price == null || stock == null) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const item = await Item.create({
      userId: req.userId,
      name,
      price,
      stock,
    });

    res.status(201).json({
      success: true,
      item,
    });
  } catch (error) {
    console.error("CREATE ITEM ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* ================= GET ALL ITEMS ================= */
export const getItems = async (req, res) => {
  try {
    const items = await Item.find({ userId: req.userId }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      items,
    });
  } catch (error) {
    console.error("GET ITEMS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* ================= GET ITEM BY ID ================= */
export const getItemById = async (req, res) => {
  try {
    const item = await Item.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    res.json({
      success: true,
      item,
    });
  } catch (error) {
    console.error("GET ITEM ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* ================= UPDATE ITEM ================= */
export const updateItem = async (req, res) => {
  try {
    const updatedItem = await Item.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedItem) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    res.json({
      success: true,
      item: updatedItem,
    });
  } catch (error) {
    console.error("UPDATE ITEM ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* ================= DELETE ITEM ================= */
export const deleteItem = async (req, res) => {
  try {
    const deletedItem = await Item.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!deletedItem) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    res.json({
      success: true,
      message: "Item deleted successfully",
    });
  } catch (error) {
    console.error("DELETE ITEM ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
