// import orderModel from "../models/orderModel.js";
// import userModel from "../models/userModel.js"
// import Stripe from "stripe"

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// //placing user order for frontend
// export const placeOrder = async (req,res) => {

//     const frontend_url ="http://localhost:5173"

//     try {
//         const newOrder = new orderModel({
//             userId: req.body.userId,
//             items: req.body.items,
//             amount:req.body.amount,
//             address:req.body.address
//         })
//         await newOrder.save();
//         await userModel.findByIdAndUpdate(req.body.userId,{cartData:{}})

//         const line_items = req.body.items.map((item)=>({
//             price_data:{
//                 currency:"inr",
//                 product_data:{
//                     name:item.name
//                 },
//                 unit_amount:item.price*100*80
//             },
//             quantity:item.quantity
//         }))

//         line_items.push({
//             price_data:{
//                 currency:"inr",
//                 process_data:{
//                     name:"Delivery Charges"
//                 },
//                 unit_amount:2*100*80
//             },
//             quantity:1
//         })
        
//         const session = await stripe.checkout.sessions.create({
//             line_items:line_items,
//             mode:"payment",
//             success_url:`${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
//             cancel_url:`${frontend_url}/verify?success=false&orderId=${newOrder._id}`
//         })

//         res.json({success:true,session_url:session.url})

//     } catch (error) {
//         console.log(error);
//         res.json({success:false,message:"Error"})
        
//     }

// }




// import axios from "axios";
// import orderModel from "../models/orderModel.js";
// import userModel from "../models/userModel.js";

// // Cashfree API Configuration
// const CASHFREE_BASE_URL = "https://sandbox.cashfree.com/pg/orders";
// const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID;
// const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY;

// // Placing user order for frontend
// export const placeOrder = async (req, res) => {
//     const frontend_url = "http://localhost:5173";

//     try {
//         // Create a new order in the database
//         const newOrder = new orderModel({
//             userId: req.body.userId,
//             items: req.body.items,
//             amount: req.body.amount,
//             address: req.body.address,
//         });
//         await newOrder.save();

//         // Clear user cart data
//         await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

//         // Prepare Cashfree order payload
//         const orderPayload = {
//             order_id: newOrder._id.toString(), // Use MongoDB's order ID
//             order_amount: req.body.amount.toFixed(2),
//             order_currency: "INR",
//             customer_details: {
//                 customer_id: req.body.userId,
//                 customer_email: req.body.email,
//                 customer_phone: req.body.phone,
//             },
//             order_meta: {
//                 return_url: `${frontend_url}/verify?orderId=${newOrder._id}&order_token={order_token}`,
//             },
//         };

//         // Create order request to Cashfree
//         const response = await axios.post(CASHFREE_BASE_URL, orderPayload, {
//             headers: {
//                 "Content-Type": "application/json",
//                 "x-client-id": CASHFREE_APP_ID,
//                 "x-client-secret": CASHFREE_SECRET_KEY,
//             },
//         });

//         const { payment_link } = response.data;

//         // Send Cashfree payment link to frontend
//         res.json({
//             success: true,
//             approval_url: payment_link, // Cashfree's payment link
//         });
//     } catch (error) {
//         console.error(error);
//         res.json({ success: false, message: "Error processing order" });
//     }
// };



// import orderModel from "../models/orderModel.js";
// import userModel from "../models/userModel.js";
// import axios from "axios"; // Use axios for Cashfree API requests

// const frontend_url = "http://localhost:5173";

// // Cashfree credentials (ensure to store them in environment variables)
// const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID;
// const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY;
// const CASHFREE_API_URL = "https://sandbox.cashfree.com/pg/orders"; // Use 'sandbox' for testing; switch to 'prod' for production

// // Placing user order for frontend
// export const placeOrder = async (req, res) => {
//   try {
//     const newOrder = new orderModel({
//       userId: req.body.userId,
//       items: req.body.items,
//       amount: req.body.amount,
//       address: req.body.address,
//     });
//     await newOrder.save();
//     await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

//     // Prepare order amount and breakdown
//     const orderAmount = req.body.amount * 80 * 100; // Multiplying by 80 for INR conversion, if needed

//     // Prepare Cashfree order payload
//     const orderPayload = {
//       order_id: newOrder._id.toString(), // Unique order ID
//       order_amount: orderAmount / 100, // Cashfree expects amount in INR (not paise)
//       order_currency: "INR",
//       customer_details: {
//         customer_id: req.body.userId,
//         customer_email: req.body.email, // Include user email
//         customer_phone: req.body.phone, // Include user phone number
//       },
//       order_meta: {
//         return_url: `${frontend_url}/verify?orderId=${newOrder._id}&cf_id={order_id}&txStatus={tx_status}`,
//       },
//       payment_methods: "card,upi,netbanking", // Allow all payment options
//     };

//     // Send request to Cashfree to create an order
//     const { data } = await axios.post(CASHFREE_API_URL, orderPayload, {
//       headers: {
//         "x-client-id": CASHFREE_APP_ID,
//         "x-client-secret": CASHFREE_SECRET_KEY,
//         "Content-Type": "application/json",
//       },
//     });

//     // Check if the order was created successfully
//     if (data.status === "OK") {
//       const paymentLink = data.payment_link; // Extract payment link from the response
//       res.json({ success: true, session_url: paymentLink });
//     } else {
//       throw new Error(data.message); // Handle Cashfree errors
//     }
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: "Error processing payment" });
//   }
// };







// import orderModel from "../models/orderModel.js";
// import userModel from "../models/userModel.js";
// import { createChecksum, verifyChecksum } from "paytmchecksum"; // For Paytm checksum
// import https from "https";

// // Paytm Configuration
// const paytmMerchantKey = process.env.PAYTM_MERCHANT_KEY;
// const paytmMerchantId = process.env.PAYTM_MERCHANT_ID;
// const frontend_url = "http://localhost:5173";

// // Placing user order for frontend using Paytm
// export const placeOrder = async (req, res) => {
//   try {
//     const newOrder = new orderModel({
//       userId: req.body.userId,
//       items: req.body.items,
//       amount: req.body.amount,
//       address: req.body.address,
//     });
//     await newOrder.save();
//     await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

//     // Prepare order details for Paytm
//     const orderId = `ORDER_${newOrder._id}_${Date.now()}`; // Unique Order ID for Paytm

//     const paytmParams = {
//       MID: paytmMerchantId,
//       WEBSITE: "WEBSTAGING",
//       INDUSTRY_TYPE_ID: "Retail",
//       CHANNEL_ID: "WEB",
//       ORDER_ID: orderId,
//       CUST_ID: req.body.userId,
//       TXN_AMOUNT: `${req.body.amount}`,
//       CALLBACK_URL: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
//       EMAIL: req.body.email,
//       MOBILE_NO: req.body.phone,
//     };

//     // Generate Paytm checksum
//     createChecksum(paytmParams, paytmMerchantKey).then((checksum) => {
//       const paytmData = {
//         ...paytmParams,
//         CHECKSUMHASH: checksum,
//       };

//       // Redirect user to Paytm payment page
//       res.json({
//         success: true,
//         paymentUrl: "https://securegw-stage.paytm.in/order/process",
//         paytmData,
//       });
//     });
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: "Error" });
//   }
// };

// // Verify Paytm transaction status (to be called on callback URL)
// export const verifyPaytmPayment = async (req, res) => {
//   try {
//     const { ORDERID, TXNID, STATUS, CHECKSUMHASH } = req.body;

//     // Verify checksum
//     const isChecksumValid = verifyChecksum(req.body, paytmMerchantKey, CHECKSUMHASH);
//     if (isChecksumValid) {
//       if (STATUS === "TXN_SUCCESS") {
//         // Update order status as successful
//         await orderModel.findByIdAndUpdate(ORDERID.split('_')[1], { status: "Success" });
//         res.redirect(`${frontend_url}/verify?success=true&orderId=${ORDERID.split('_')[1]}`);
//       } else {
//         // Update order status as failed
//         await orderModel.findByIdAndUpdate(ORDERID.split('_')[1], { status: "Failed" });
//         res.redirect(`${frontend_url}/verify?success=false&orderId=${ORDERID.split('_')[1]}`);
//       }
//     } else {
//       res.json({ success: false, message: "Checksum mismatch" });
//     }
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: "Error verifying payment" });
//   }
// };



// import orderModel from "../models/orderModel.js";
// import userModel from "../models/userModel.js";
// import Razorpay from "razorpay";

// const razorpay = new Razorpay({
//     key_id: process.env.RAZORPAY_KEY_ID,
//     key_secret: process.env.RAZORPAY_KEY_SECRET
// });

// // Placing user order for frontend
// export const placeOrder = async (req, res) => {

//     const frontend_url = "http://localhost:5173";

//     try {
//         // Save order in the database
//         const newOrder = new orderModel({
//             userId: req.body.userId,
//             items: req.body.items,
//             amount: req.body.amount,
//             address: req.body.address
//         });
//         await newOrder.save();
//         await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

//         // Calculate total amount in paisa (Razorpay uses INR in paisa)
//         const amountInPaisa = req.body.amount * 100;

//         // Create Razorpay order
//         const options = {
//             amount: amountInPaisa, // Amount in paisa
//             currency: "INR",
//             receipt: newOrder._id.toString(), // Razorpay requires a unique receipt ID
//         };

//         const order = await razorpay.orders.create(options);
//         console.log("Razorpay order:", order);

//         res.json({
//             success: true,
//             razorpayOrderId: order.id,
//             amount: amountInPaisa,
//             currency: "INR",
//             session_url: order.session_url, // Verify this field
//             frontend_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`
//         });

//     } catch (error) {
//         console.log(error);
//         res.json({ success: false, message: "Error" });
//     }
// };




// import Razorpay from "razorpay";
// import orderModel from "../models/orderModel.js";
// import userModel from "../models/userModel.js";

// // Initialize Razorpay
// const razorpay = new Razorpay({
//     key_id: process.env.RAZORPAY_KEY_ID,
//     key_secret: process.env.RAZORPAY_KEY_SECRET,
// });

// export const placeOrder = async (req, res) => {
//     const frontend_url = "http://localhost:5173";

//     try {
//         // Save the new order in the database
//         const newOrder = new orderModel({
//             userId: req.body.userId,
//             items: req.body.items,
//             amount: req.body.amount,
//             address: req.body.address,
//         });

//         await newOrder.save();
//         await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

//         // Calculate amount in paisa (for Razorpay)
//         const amountInPaisa = req.body.amount * 100;

//         // Create a new Razorpay order
//         const options = {
//             amount: amountInPaisa, // amount in paisa
//             currency: "INR",
//             receipt: newOrder._id.toString(),
//         };

//         const order = await razorpay.orders.create(options);

//         // Send order details to frontend
//         res.json({
//             success: true,
//             orderId: order.id, // Razorpay order ID
//             amount: amountInPaisa,
//             currency: "INR",
//         });
//     } catch (error) {
//         console.error("Error placing order:", error);
//         res.status(500).json({ success: false, message: "Error placing order" });
//     }
// };









// import orderModel from "../models/orderModel.js";
// import userModel from "../models/userModel.js";
// import Razorpay from "razorpay";

// // Initialize Razorpay instance
// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET
// });

// // Placing user order for frontend
// export const placeOrder = async (req, res) => {
//   const frontend_url = "http://localhost:5173";

//   try {
//     // Create new order in your database
//     const newOrder = new orderModel({
//       userId: req.body.userId,
//       items: req.body.items,
//       amount: req.body.amount,
//       address: req.body.address,
//     });
//     await newOrder.save();

//     // Clear user's cart after placing the order
//     await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

//     // Calculate total amount (Razorpay requires amount in paise)
//     const totalAmount = Math.round(req.body.amount * 100); // Converting to paise

//     // Create Razorpay order
//     const options = {
//       amount: totalAmount, // amount in paise
//       currency: "INR",
//       receipt: newOrder._id.toString(), // unique identifier for this order
//     };

//     const razorpayOrder = await razorpay.orders.create(options);

//     // Send order details and Razorpay order ID to the frontend
//     res.json({
//       success: true,
//       razorpay_order_id: razorpayOrder.id,
//       amount: totalAmount,
//       currency: "INR",
//       orderId: newOrder._id
//     });

//   } catch (error) {
//     console.error(error);
//     res.json({ success: false, message: "Error creating Razorpay order" });
//   }
// };











import orderModel from "../models/orderModel.js"
import userModel from "../models/userModel.js"


// Placing Orders using COD Method
const placeOrder = async(req,res) => {

    try {
      
      const { userId, items, amount, address } = req.body

      const orderData = {
        userId,
        items,
        address,
        amount,
        paymentMethod:'COD',
        payment:false,
        date: Date.now()
      }

      const newOrder = new orderModel(orderData)
      await newOrder.save()

      await userModel.findByIdAndUpdate(userId,{cartData:{}})

      res.json({success:true,message:"Order Placed"})

    } catch (error) {
      console.log(error);
      res.json({success:false, message:error.message})
    }
}

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
const userOrders = async(req,res) => {
  try {
    
    const {userId} = req.body

    const orders = await orderModel.find({ userId })
    res.json({success:true,data:orders})

  } catch (error) {
      console.log(error);
      res.json({success:false,message:error.message})
  }
} 

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