
import mongoose from "mongoose";
import Invoice from "../models/invoiceModels.js";
import Item from "../models/itemModel.js";

export const createInvoice = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const { customerId, items } = req.body;

    if (!customerId || !items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid invoice data",
      });
    }

    /* -------------------- GENERATE INVOICE NO -------------------- */
    const lastInvoice = await Invoice
      .findOne()
      .sort({ createdAt: -1 })
      .session(session);

    let nextNumber = 1;

    if (lastInvoice?.invoiceNo) {
      const lastNum = Number(
        lastInvoice.invoiceNo.replace("INV", "")
      );
      nextNumber = lastNum + 1;
    }

    const invoiceNo = `INV${String(nextNumber).padStart(3, "0")}`;

    /* -------------------- PROCESS ITEMS -------------------- */
    let subTotal = 0;
    const invoiceItems = [];

    for (const item of items) {
      const dbItem = await Item.findById(item.itemId).session(session);

      if (!dbItem) {
        throw new Error(`Item not found`);
      }

      if (dbItem.stock < item.quantity) {
        throw new Error(
          `Insufficient stock for ${dbItem.name}`
        );
      }

      const itemTotal = item.price * item.quantity;
      subTotal += itemTotal;

      invoiceItems.push({
        itemId: dbItem._id,
        name: dbItem.name,
        price: item.price,
        quantity: item.quantity,
        total: itemTotal,
      });

      // Reduce stock
      dbItem.stock -= item.quantity;
      await dbItem.save({ session });
    }

    const grandTotal = subTotal; // add tax/discount later if needed

    /* -------------------- CREATE INVOICE -------------------- */
    const invoice = await Invoice.create(
      [
        {
          userId: req.userId,
          invoiceNo,
          customerId,
          items: invoiceItems,
          subTotal,
          grandTotal,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: "Invoice created successfully",
      invoice: invoice[0],
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    res.status(500).json({
      success: false,
      message: error.message || "Invoice creation failed",
    });
  }
};


/* ================= GET ALL CUSTOMERS ================= */
export const getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find({ userId: req.userId }).populate("customerId").populate("userId").sort({ createdAt: -1 });

    res.json({
      success: true,
      invoices,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};





