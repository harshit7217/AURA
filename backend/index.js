import express from 'express';
import cors from 'cors';
import connectDB from './config/database.js';
import juniorCandidateRoute from "./routes/juniorCandidteRoute.js"
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.SECRET_PORT;

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/junior-candidates", juniorCandidateRoute);

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
