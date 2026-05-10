import { Router } from 'express';

const router = Router();

// Get products
router.get('/products', (req, res) => {
  res.json({
    products: [
      { id: 1, name: 'Premium Red Dragon Fruit', price: 5.99, unit: 'kg', farmer: 'John Doe', image: '/images/red-dragon.jpg' },
      { id: 2, name: 'White Flesh Dragon Fruit', price: 4.50, unit: 'kg', farmer: 'Jane Smith', image: '/images/white-dragon.jpg' },
      { id: 3, name: 'Yellow Dragon Fruit (Palora)', price: 8.99, unit: 'kg', farmer: 'Bob Green', image: '/images/yellow-dragon.jpg' },
    ]
  });
});

export default router;
