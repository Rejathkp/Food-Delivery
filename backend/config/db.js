import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://rejathkp:Rejathkp12@rejath.aalz2ev.mongodb.net/food-deli')
    .then(()=>console.log("DB connected"));
}