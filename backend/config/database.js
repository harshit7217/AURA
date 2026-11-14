import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Database is connected');
    }catch (err) {
        console.error('Error connecting to the database: ', err.message);
        process.exit(1);
    }
}

export default connectDB;