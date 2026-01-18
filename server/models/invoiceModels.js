// models/invoiceModel.js
import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        customerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
            required: true,
        },

        invoiceNo: {
            type: String,
            unique: true,
        },

        items: [
            {
                itemId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Item",
                    required: true,
                },
                name: String,
                price: Number,
                quantity: Number,
                total: Number,
            },
        ],

        subTotal: { type: Number, required: true },
        grandTotal: { type: Number, required: true },

        status: {
            type: String,
            enum: ["CREATED", "CANCELLED"],
            default: "CREATED",
        },
    },
    { timestamps: true }
);

export default mongoose.models.Invoice ||
    mongoose.model("Invoice", invoiceSchema);
