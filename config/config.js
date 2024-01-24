import mongoose from "mongoose"; 

export const connectDB = async () => mongoose.
connect(process.env.DB_URI).then(() => console.log('dataBase Connected!'))