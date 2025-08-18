import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  try {
    // Get token from "Authorization: Bearer <token>"
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const token = authHeader.split(" ")[1]; // Remove "Bearer"
    if (!token) {
      return res.status(401).json({ success: false, message: "Invalid token format" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id; // attach userId safely
    next();
  } catch (error) {
    console.error("JWT Error:", error.message);
    res.status(401).json({ success: false, message: "Unauthorized" });
  }
};

export default authMiddleware;
