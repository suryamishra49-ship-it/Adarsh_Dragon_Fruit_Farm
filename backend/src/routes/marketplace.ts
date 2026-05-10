import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get products
router.get('/products', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        farmer: {
          select: { name: true }
        }
      }
    });
    
    // Map data to match frontend expectations
    const formattedProducts = products.map(p => ({
      ...p,
      farmer: p.farmer.name,
      image: p.image || '/images/placeholder.jpg' // default image if none provided
    }));

    res.json({ products: formattedProducts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

export default router;
