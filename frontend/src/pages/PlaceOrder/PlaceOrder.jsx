// import React, { useContext, useEffect, useState } from 'react'
// import "./PlaceOrder.css"
// import { StoreContext } from '../../context/StoreContext'
// import axios from 'axios'

// const PlaceOrder = () => {

//   const {getTotalCartAmount,token,food_list,cartItems,url} = useContext(StoreContext)

//   const [data,setData] = useState({
//     firstName:"",
//     lastName:"",
//     email:"",
//     street:"",
//     city:"",
//     state:"",
//     zipcode:"",
//     country:"",
//     phone:""
//   })

//   const onChangerHandler = (event) => {
//     const name = event.target.name
//     const value = event.target.value
//     setData(data=>({...data,[name]:value}))
//   }

//   const placeOrder = async (event) => {
//     event.preventDefault()
//     let orderItems = []
//     food_list.map((item)=>{
//       if (cartItems[item._id]>0) {
//         let itemInfo = item;
//         itemInfo["quantity"] = cartItems[item._id]
//         orderItems.push(itemInfo);
//       }
//     })
//     let orderData = {
//       address:data,
//       items:orderItems,
//       amount:getTotalCartAmount()+2,
//     }
//     let response = await axios.post(url+"/api/order/place",orderData,{headers:{token}})
//     if (response.data.success) {
//       const { session_url } = response.data;
//       if (session_url) {
//           window.location.replace(session_url);
//       } else {
//           alert("Session URL is undefined");
//       }
//   } else {
//       alert("Error");
//   }
//   }

//   // const placeOrder = async (event) => {
//   //   event.preventDefault();

//   //   try {
//   //     let orderItems = [];
//   //     food_list.forEach((item) => {
//   //       if (cartItems[item._id] > 0) {
//   //         let itemInfo = { ...item, quantity: cartItems[item._id] };
//   //         orderItems.push(itemInfo);
//   //       }
//   //     });

//   //     let orderData = {
//   //       address: data,
//   //       items: orderItems,
//   //       amount: getTotalCartAmount() + 2 * 80, // Delivery fee in INR
//   //     };

//   //     const response = await axios.post(
//   //       `${url}/api/order/place`,
//   //       orderData,
//   //       {
//   //         headers: {
//   //           token,
//   //           'x-client-id': process.env.CASHFREE_CLIENT_ID,
//   //           'x-client-secret': process.env.CASHFREE_CLIENT_SECRET,
//   //         },
//   //       }
//   //     );

//   //     if (response.data.success) {
//   //       const { session_url } = response.data;
//   //       window.location.replace(session_url);
//   //     } else {
//   //       alert('Error placing order');
//   //     }
//   //   } catch (error) {
//   //     console.error('Order placement failed:', error);
//   //     alert(`Order failed: ${error.response?.data?.message || 'Unexpected error'}`);
//   //   }
//   // };

//   return (
//     <form onSubmit={placeOrder} className='place-order'>
//       <div className='place-order-left'>
//         <p className='title'>Delivery Information</p>
//         <div className="multi-fields">
//           <input
//    required name='firstName' onChange={onChangerHandler} value={data.firstName} type="text" placeholder='First name' />
//           <input
//    required name='lastName' onChange={onChangerHandler} value={data.lastName} type="text" placeholder='Last name'/>
//         </div>
//         <input
//    required name='email' onChange={onChangerHandler} value={data.email} type="email" placeholder='Email address'/>
//         <input
//    required name='street' onChange={onChangerHandler} value={data.street} type="text" placeholder='Street'/>
//         <div className='multi-fields'>
//           <input
//    required name='city' onChange={onChangerHandler} value={data.city} type="text" placeholder='City' />
//           <input
//    required name='state' onChange={onChangerHandler} value={data.state} type="text" placeholder='State'/>
//         </div>
//         <div className='multi-fields'>
//           <input
//    required name='zipcode' onChange={onChangerHandler} value={data.zipcode} type="text" placeholder='Zip code' />
//           <input
//    required name='country' onChange={onChangerHandler} value={data.country} type="text" placeholder='Country'/>
//         </div>
//         <input
//    required name='phone' onChange={onChangerHandler} value={data.phone} type="text" placeholder='Phone'/>
//       </div>
//       <div className='place-order-right'>
//       <div className="cart-total">
//         <h2>Cart Totals</h2>
//         <div>
//           {/* <div className="cart-total-details">
//               <p>Subtotal</p>
//               <p>${getTotalCartAmount()}</p>
//             </div>
//             <hr />
//             <div className="cart-total-details">
//               <p>Delivery Fee</p>
//               <p>${getTotalCartAmount()===0?0:2}</p>
//             </div>
//             <hr />
//             <div className="cart-total-details">
//               <b>Total</b>
//               <b>${getTotalCartAmount()===0?0:getTotalCartAmount()+2}</b>
//             </div> */}
//             <div className="cart-total-details">
//               <p>Subtotal</p>
//               <p>₹{getTotalCartAmount()}</p>
//             </div>
//             <hr />
//             <div className="cart-total-details">
//                 <p>Delivery Fee</p>
//                 <p>₹{getTotalCartAmount() === 0 ? 0 : 2 * 80}</p> {/* Convert delivery fee to INR */}
//             </div>
//             <hr />
//             <div className="cart-total-details">
//                 <b>Total</b>
//                 <b>₹{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2 * 80}</b> {/* Convert total to INR */}
//             </div>

//           </div>
//           <button type='submit'>PROCEED TO PAYMENT</button>
//         </div>
//       </div>
//     </form>
//   )
// }

// export default PlaceOrder

// import React, { useContext, useState } from "react";
// import "./PlaceOrder.css";
// import { StoreContext } from "../../context/StoreContext";
// import axios from "axios";
// import Razorpay from "razorpay";

// const PlaceOrder = () => {
//   const { getTotalCartAmount, token, food_list, cartItems, url } =
//     useContext(StoreContext);

//   const [data, setData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     street: "",
//     city: "",
//     state: "",
//     zipcode: "",
//     country: "",
//     phone: "",
//   });

//   // Handle input
//   //    required changes
//   const onChangerHandler = (event) => {
//     const { name, value } = event.target;
//     setData((prevData) => ({ ...prevData, [name]: value }));
//   };

//   // Function to load Razorpay script
//   const loadRazorpayScript = () => {
//     return new Promise((resolve) => {
//       const script = document.createElement("script");
//       script.src = "https://checkout.razorpay.com/v1/checkout.js";
//       script.onload = () => resolve(true);
//       script.onerror = () => resolve(false);
//       document.body.appendChild(script);
//     });
//   };

//   // Place order function
//   const placeOrder = async (event) => {
//     event.preventDefault();

//     // Prepare order items
//     const orderItems = food_list
//       .filter((item) => cartItems[item._id] > 0)
//       .map((item) => ({
//         ...item,
//         quantity: cartItems[item._id],
//       }));

//     const orderData = {
//       address: data,
//       items: orderItems,
//       amount: getTotalCartAmount() + 2 * 80, // Add delivery fee in INR
//     };

//     try {
//       // Send order data to backend
//       const response = await axios.post(`${url}/api/order/place`, orderData, {
//         headers: { token },
//       });

//       if (response.data.success) {
//         const { razorpay_order_id, amount, currency, orderId } = response.data;

//         // Load Razorpay script and initiate payment
//         const isScriptLoaded = await loadRazorpayScript();
//         if (!isScriptLoaded) {
//           alert("Failed to load Razorpay script");
//           return;
//         }

//         const options = {
//           key: process.env.rzp_test_atYj0FqtD6vMdk, // Replace with your Razorpay key ID
//           amount,
//           currency,
//           name: "Your Store Name",
//           description: "Thank you for your order!",
//           order_id: razorpay_order_id,
//           handler: function (response) {
//             alert(`Payment successful! Order ID: ${orderId}`);
//             // Redirect or clear cart after successful payment
//             window.location.href = "/order-success";
//           },
//           prefill: {
//             name: `${data.firstName} ${data.lastName}`,
//             email: data.email,
//             contact: data.phone,
//           },
//           theme: {
//             color: "#3399cc",
//           },
//         };

//         const paymentObject = new window.Razorpay(options);
//         paymentObject.open();
//       } else {
//         alert("Error placing order");
//       }
//     } catch (error) {
//       console.error("Order placement failed:", error);
//       alert(
//         `Order failed: ${error.response?.data?.message || "Unexpected error"}`
//       );
//     }
//   };

//   return (
//     <form onSubmit={placeOrder} className="place-order">
//       <div className="place-order-left">
//         <p className="title">Delivery Information</p>
//         <div className="multi-fields">
//           <input
//             required
//             name="firstName"
//             onChange={onChangerHandler}
//             value={data.firstName}
//             type="text"
//             placeholder="First name"
//           />
//           <input
//             required
//             name="lastName"
//             onChange={onChangerHandler}
//             value={data.lastName}
//             type="text"
//             placeholder="Last name"
//           />
//         </div>
//         <input
//           required
//           name="email"
//           onChange={onChangerHandler}
//           value={data.email}
//           type="email"
//           placeholder="Email address"
//         />
//         <input
//           required
//           name="street"
//           onChange={onChangerHandler}
//           value={data.street}
//           type="text"
//           placeholder="Street"
//         />
//         <div className="multi-fields">
//           <input
//             required
//             name="city"
//             onChange={onChangerHandler}
//             value={data.city}
//             type="text"
//             placeholder="City"
//           />
//           <input
//             required
//             name="state"
//             onChange={onChangerHandler}
//             value={data.state}
//             type="text"
//             placeholder="State"
//           />
//         </div>
//         <div className="multi-fields">
//           <input
//             required
//             name="zipcode"
//             onChange={onChangerHandler}
//             value={data.zipcode}
//             type="text"
//             placeholder="Zip code"
//           />
//           <input
//             required
//             name="country"
//             onChange={onChangerHandler}
//             value={data.country}
//             type="text"
//             placeholder="Country"
//           />
//         </div>
//         <input
//           required
//           name="phone"
//           onChange={onChangerHandler}
//           value={data.phone}
//           type="text"
//           placeholder="Phone"
//         />
//       </div>

//       <div className="place-order-right">
//         <div className="cart-total">
//           <h2>Cart Totals</h2>
//           <div className="cart-total-details">
//             <p>Subtotal</p>
//             <p>₹{getTotalCartAmount()}</p>
//           </div>
//           <hr />
//           <div className="cart-total-details">
//             <p>Delivery Fee</p>
//             <p>₹{getTotalCartAmount() === 0 ? 0 : 40}</p>
//           </div>
//           <hr />
//           <div className="cart-total-details">
//             <b>Total</b>
//             <b>₹{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 40}</b>
//           </div>
//           <button type="submit">PLACE ORDER</button>
//         </div>
//       </div>
//     </form>
//   );
// };

// export default PlaceOrder;

import React, { useContext, useEffect, useState } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cartItems, setCartItems, url } =
    useContext(StoreContext);

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("COD");

  // Handle input changes
  const onChangerHandler = (event) => {
    const { name, value } = event.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle payment method selection
  const onPaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  // Place order function
  const placeOrder = async (event) => {
    console.log("hello");

    event.preventDefault();

    const orderItems = food_list
      .filter((item) => cartItems[item._id] > 0)
      .map((item) => ({
        ...item,
        quantity: cartItems[item._id],
      }));

    const orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + (getTotalCartAmount() === 0 ? 0 : 40), // Add delivery fee
      paymentMethod,
    };

    try {
      const response = await axios.post(`${url}/api/order/place`, orderData, {
        headers: { token },
      });

      if (response.data.success) {
        alert("Order placed successfully using Cash on Delivery!");
        window.location.href = "/myorders";
        // const { session_url } = response.data;
        // windows.location.replace(session_url);
      } else {
        alert("Error placing order");
      }
    } catch (error) {
      console.error("Order placement failed:", error);
      alert(
        `Order failed: ${error.response?.data?.message || "Unexpected error"}`
      );
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/cart");
    } else if (getTotalCartAmount() == 0) {
      navigate("/cart");
    }
  }, [token]);

  return (
    <form onSubmit={placeOrder} className="place-order">
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input
            required
            name="firstName"
            onChange={onChangerHandler}
            value={data.firstName}
            type="text"
            placeholder="First name"
          />
          <input
            required
            name="lastName"
            onChange={onChangerHandler}
            value={data.lastName}
            type="text"
            placeholder="Last name"
          />
        </div>
        <input
          required
          name="email"
          onChange={onChangerHandler}
          value={data.email}
          type="email"
          placeholder="Email address"
        />
        <input
          required
          name="street"
          onChange={onChangerHandler}
          value={data.street}
          type="text"
          placeholder="Street"
        />
        <div className="multi-fields">
          <input
            required
            name="city"
            onChange={onChangerHandler}
            value={data.city}
            type="text"
            placeholder="City"
          />
          <input
            required
            name="state"
            onChange={onChangerHandler}
            value={data.state}
            type="text"
            placeholder="State"
          />
        </div>
        <div className="multi-fields">
          <input
            required
            name="zipcode"
            onChange={onChangerHandler}
            value={data.zipcode}
            type="text"
            placeholder="Zip code"
          />
          <input
            required
            name="country"
            onChange={onChangerHandler}
            value={data.country}
            type="text"
            placeholder="Country"
          />
        </div>
        <input
          required
          name="phone"
          onChange={onChangerHandler}
          value={data.phone}
          type="text"
          placeholder="Phone"
        />
      </div>

      <div className="place-order-right">
        <div className="cart-totals">
          <h2>Cart Totals</h2>
          <div className="cart-totals-details">
            <p>Subtotal</p>
            <p>₹{getTotalCartAmount()}</p>
          </div>
          <hr />
          <div className="cart-totals-details">
            <p>Delivery Fee</p>
            <p>₹{getTotalCartAmount() === 0 ? 0 : 40}</p>
          </div>
          <hr />
          <div className="cart-totals-details">
            <b>Total</b>
            <b>₹{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 40}</b>
          </div>

          {/* Payment Method Section */}
          <h3 className="cart-totals" style={{ marginTop: "30px" }}>
            Payment Method
          </h3>
          <div className="payment-methods">
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="COD"
                checked={paymentMethod === "COD"}
                onChange={onPaymentMethodChange}
              />
              Cash on Delivery
            </label>
          </div>

          {/* Place Order Button */}
          <button type="submit">PLACE ORDER</button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
