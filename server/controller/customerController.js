import Customer from "../models/customerModel.js";

/* ================= CREATE CUSTOMER ================= */
export const createCustomer = async (req, res) => {
  try {
    const { name, phone, email, address } = req.body;


    if (!name || !phone || !email || !address) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }


    const existingCustomer = await Customer.findOne({ email })
    if (existingCustomer) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const customer = await Customer.create({
      userId: req.userId, // from JWT middleware
      name,
      phone,
      email,
      address,
    });

    res.status(201).json({
      success: true,
      message: "Customer created successfully",
      customer,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* ================= GET ALL CUSTOMERS ================= */
export const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find({ userId: req.userId })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      customers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* ================= GET CUSTOMER BY ID ================= */
export const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    res.json({
      success: true,
      customer,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* ================= UPDATE CUSTOMER ================= */
export const updateCustomer = async (req, res) => {
  try {
    const updatedCustomer = await Customer.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedCustomer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    res.json({
      success: true,
      message: "Customer updated successfully",
      customer: updatedCustomer,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* ================= DELETE CUSTOMER ================= */
export const deleteCustomer = async (req, res) => {
  try {
    const deleted = await Customer.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    res.json({
      success: true,
      message: "Customer deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
