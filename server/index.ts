import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Chat endpoint
app.post('/api/chat', (req, res) => {
  const { message } = req.body;
  console.log('Received message:', message);
  res.status(200).json({ success: true });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 