import express from "express";
import cors from "cors";
import http from "http"
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import 'dotenv/config.js';
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";

// app config
const app = express();
const server = http.createServer(app)


// middleware
app.use(express.json());

const allowedOrigins = [
  "http://localhost:3000",                      // local frontend
  "https://food-delivery-546h.onrender.com",     // deployed frontend
  "https://food-delivery-admin-3nuv.onrender.com"    //deployed admin 
];

app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// db connection
connectDB();

// api endpoints
app.use("/api/status",(req,res)=> res.send("Server is live"))
app.use("/api/food", foodRouter);
app.use("/images", express.static('uploads'));
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

app.get("/", (req, res) => {
  res.send("API Working");
});

if(process.env.NODE_ENV !== "production") {
  const port = process.env.PORT || 4000;
  server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

export default server
