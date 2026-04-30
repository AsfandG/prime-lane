import Order from "../model/order.js";
import { generateToken, sendEmail } from "../utils/utils.js";

// create order
export const createOrder = async (req, res) => {
  try {
    const { items, totalAmount, address, paymentId } = req.body;

    if (!items || items.length === 0 || !totalAmount || !address) {
      return res.json(400).json({ message: "Invalid request!" });
    } else {
      const order = await Order.create({
        userId: req.user._id,
        items,
        address,
        totalAmount,
        paymentId,
      });

      const message = `<h3>Dear ${req.user.name},</h3>  <p>Thank you for your order! Your order has been successfully created with the following details:
      <ul>
      <li>Order ID: ${order._id}</li>
      <li>Total Amount: $${totalAmount}</li>
      <li>Address: ${address.street}, ${address.city}</li>
      
      </ul>
      `;
      await sendEmail(req.user.email, "Order Created", message);
      res.status(200).json({ message: "Order created!", order });
    }
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.message });
  }
};

// Get user orders
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).populate(
      "items.product",
      "name price",
    );

    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.message });
  }
};

// Get All Orders
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate("userId", "id name");
    res.status(200).json({ orders });
  } catch (error) {
    res
      .status(500)
      .json({ message: "error fetching orders", error: error.message });
  }
};

// update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (order) {
      order.status = status;
      await order.save();
      res.status(200).json({ message: "Order status updated", order });
    } else {
      res.status(200).json({ message: "Order not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating order status", error: error.message });
  }
};
