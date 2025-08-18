import orderModel from "../models/orderModel.js"
import userModel from "../models/userModel.js"

const placeOrder = async (req, res) => {
  try {
    const { items, amount, address } = req.body;

    const orderData = {
      userId: req.userId, // ✅ from middleware, not body
      items,
      address,
      amount,
      paymentMethod: "COD",
      payment: false,
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    // optional: clear user cart after order
    await userModel.findByIdAndUpdate(req.userId, { cartData: {} });

    res.json({ success: true, message: "Order placed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error placing order" });
  }
};

// All Orders data for Admin Panel
const allOrders = async(req,res) => {
  try {
    const orders = await orderModel.find({}) 
    res.json({success:true, data:orders})
  } catch (error) {
    console.log(error);
    res.json({success:false,message:"Error"})
  }
}

// User Order data for Frontend
const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.userId }); // ✅ filter
    res.json({ success: true, data: orders });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


// Update Order Status for Admin Panel
const updateStatus = async(req,res) => {
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status})
    res.json({success:true,message:"Status Updated"})
  } catch (error) {
    console.log(error);
    res.json({success:false,message:"Error"})
    
  }
}

export {placeOrder,allOrders,userOrders,updateStatus}