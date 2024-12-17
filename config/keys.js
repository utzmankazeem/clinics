import dotenv from 'dotenv';
dotenv.config()
import mongoose from 'mongoose';
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URI, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            family:4
        });
    } catch (err) {
        throw err
    }
}

export default connectDB;