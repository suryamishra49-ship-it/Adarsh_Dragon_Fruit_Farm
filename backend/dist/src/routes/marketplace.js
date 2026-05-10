"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});
exports.default = router;
