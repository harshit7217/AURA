import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/database.js';
import juniorCandidateRoute from "./routes/juniorCandidteRoute.js"

const app = express();
const PORT = 5000;

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/junior-candidates", juniorCandidateRoute);

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
