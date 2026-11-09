import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 5000;

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

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
