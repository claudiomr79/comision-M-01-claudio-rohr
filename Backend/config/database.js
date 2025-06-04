import mongoose from "mongoose";
import dotenv from 'dotenv'; // Importar dotenv

dotenv.config(); // Cargar variables de entorno

const connectDB = async () => {
  try {
    // Usar la variable de entorno MONGODB_URI
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

export default connectDB;
