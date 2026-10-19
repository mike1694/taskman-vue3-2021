import express from 'express';
import cors from 'cors';
import tasksRouter from './routes/tasks';
import historyRouter from './routes/history';
import initDb from './db';

const app = express();
const PORT = process.env.BACKEND_PORT || process.env.PORT || 3000;

// Initialize database on startup
initDb().then(() => {
  console.log('Database initialized');
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/', tasksRouter);
app.use('/', historyRouter);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});

export default app;
