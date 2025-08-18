import userModel from "../models/userModel.js";

// Add items to user cart 
export const addToCart = async (req, res) => {
    try {
        const userData = await userModel.findById(req.userId);
        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        let cartData = userData.cartData || {};
        const itemId = req.body.itemId;

        if (!cartData[itemId]) {
            cartData[itemId] = 1;
        } else {
            cartData[itemId] += 1;
        }

        await userModel.findByIdAndUpdate(req.userId, { cartData });
        res.json({ success: true, message: "Added to Cart" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error adding to cart" });
    }
};


// Remove items from user cart
export const removeFromCart = async (req, res) => {
    try {
        const userData = await userModel.findById(req.userId);
        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        let cartData = userData.cartData || {};
        const itemId = req.body.itemId;

        if (cartData[itemId] > 0) {
            cartData[itemId] -= 1;
            if (cartData[itemId] === 0) {
                delete cartData[itemId]; // optional cleanup
            }
        }

        await userModel.findByIdAndUpdate(req.userId, { cartData });
        res.json({ success: true, message: "Removed From Cart" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error removing from cart" });
    }
};


// Fetch user cart data
export const getCart = async (req, res) => {
    try {
        const userData = await userModel.findById(req.userId);
        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        let cartData = userData.cartData || {};
        res.json({ success: true, cartData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error fetching cart" });
    }
};
