import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import guideRoutes from './routes/guide';
import scannerRoutes from './routes/scanner';
import marketplaceRoutes from './routes/marketplace';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Root Route
app.get('/', (req, res) => {
  res.send('Adarsh Dragon Fruit Farm API is live!');
});

// Routes
app.use('/api/guide', guideRoutes);
app.use('/api/scanner', scannerRoutes);
app.use('/api/marketplace', marketplaceRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Dragon Fruit Platform API is running.' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
