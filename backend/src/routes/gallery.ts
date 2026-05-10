import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get gallery items
router.get('/', async (req, res) => {
  try {
    const items = await prisma.galleryItem.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, items });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch gallery' });
  }
});

export default router;
