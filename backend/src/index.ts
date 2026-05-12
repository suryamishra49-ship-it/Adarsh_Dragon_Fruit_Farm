import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import guideRoutes from './routes/guide';
import marketplaceRoutes from './routes/marketplace';

import authRoutes from './routes/auth';
import appointmentRoutes from './routes/appointments';
import orderRoutes from './routes/orders';
import galleryRoutes from './routes/gallery';
import activityRoutes from './routes/activity';

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
app.use('/api/auth', authRoutes);
app.use('/api/guide', guideRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/activity', activityRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Dragon Fruit Platform API is running.' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
