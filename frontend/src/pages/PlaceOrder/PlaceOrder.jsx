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
        headers: { 
          Authorization: `Bearer ${token}` 
        },
      });

      if (response.data.success) {
        alert("Order placed successfully using Cash on Delivery!");
        window.location.href = "/myorders";
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
