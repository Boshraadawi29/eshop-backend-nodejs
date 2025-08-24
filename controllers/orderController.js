const { Order } = require('../models/order');
const { OrderItem } = require('../models/orderItem');

exports.getAllOrders = async (req, res) => {
  try {
    const orderList = await Order.find().sort({ date: -1 });

    if (!orderList || orderList.length === 0) {
      res.status(404).json({ success: false, message: 'There is no Orders' });
    }
    res.status(200).json(orderList);
  } catch (err) {
    res.status(500).json({
      success: false,
    });
  }
};

exports.createOrder = async (req, res) => {
  const orderItemsIds = await Promise.all(
    req.body.orderItems.map(async (orderItem) => {
      let newOrderItem = new OrderItem({
        quantity: orderItem.quantity,
        product: orderItem.product,
      });

      newOrderItem = await newOrderItem.save();
      return newOrderItem._id;
    }),
  );

  const totalPrices = await Promise.all(
    orderItemsIds.map(async (orderItemId) => {
      orderItem = await OrderItem.findById(orderItemId).populate(
        'product',
        'price',
      );

      if (!orderItem) {
        return res
          .status(400)
          .json({
            success: false,
            message: `OrderItem with id ${orderItemId} not found`,
          });
      }

      if (!orderItem.product) {
        return res
          .status(400)
          .json({
            success: false,
            message: `Product not found for OrderItem ${orderItemId}`,
          });
      }

      return orderItem.quantity * orderItem.product.price;
    }),
  );

  const totalPrice = totalPrices.reduce((acc, curr) => acc + curr, 0);
  const order = new Order({
    orderItems: orderItemsIds,
    shippingAddress1: req.body.shippingAddress1,
    shippingAddress2: req.body.shippingAddress2,
    city: req.body.city,
    zip: req.body.zip,
    country: req.body.country,
    status: req.body.status,
    totalPrice: totalPrice,
    date: req.body.date,
    user: req.body.user,
    phone: req.body.phone,
  });
  try {
    const createdOrder = await order.save();
    res.status(200).json({ createdOrder });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);
    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.status(200).json(order);
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: 'Error while getting order by ID' });
  }
};
