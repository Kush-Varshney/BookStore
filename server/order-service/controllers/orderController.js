import Order from "../models/orderModel.js"

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, totalPrice } = req.body

    if (items && items.length === 0) {
      return res.status(400).json({ message: "No order items" })
    }

    const order = new Order({
      userId: req.user.id,
      items,
      shippingAddress,
      paymentMethod,
      totalPrice,
    })

    const createdOrder = await order.save()
    res.status(201).json(createdOrder)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// @desc    Get all orders by user
// @route   GET /api/orders/user/:userId
// @access  Private
export const getOrdersByUser = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId })
    res.json(orders)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)

    if (order) {
      // Check if the user is authorized to view this order
      if (order.userId.toString() !== req.user.id && req.user.role !== "admin") {
        return res.status(403).json({ message: "Not authorized to view this order" })
      }

      res.json(order)
    } else {
      res.status(404).json({ message: "Order not found" })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Cancel an order
// @route   DELETE /api/orders/:id
// @access  Private
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)

    if (order) {
      // Check if the user is authorized to cancel this order
      if (order.userId.toString() !== req.user.id && req.user.role !== "admin") {
        return res.status(403).json({ message: "Not authorized to cancel this order" })
      }

      // Only allow cancellation if order is pending or processing
      if (order.status === "shipped" || order.status === "delivered") {
        return res.status(400).json({ message: "Cannot cancel order that has been shipped or delivered" })
      }

      order.status = "cancelled"
      await order.save()

      res.json({ message: "Order cancelled" })
    } else {
      res.status(404).json({ message: "Order not found" })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
