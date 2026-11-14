import express from 'express';
import cors from 'cors';
<<<<<<< HEAD
import connectDB from './config/database.js';
import juniorCandidateRoute from "./routes/juniorCandidteRoute.js"
=======
>>>>>>> 471e47bf24da4b1d6cc34243f6f9edd890e29064

const app = express();
const PORT = 5000;

<<<<<<< HEAD
connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/junior-candidates", juniorCandidateRoute);
=======
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Backend connected successfully',
    timestamp: new Date().toISOString(),
  });
});

app.post('/api/message', (req, res) => {
  const { name = 'Guest' } = req.body || {};

  res.json({
    success: true,
    message: `Hello ${name}! The frontend is connected to the backend.`,
  });
});
>>>>>>> 471e47bf24da4b1d6cc34243f6f9edd890e29064

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
