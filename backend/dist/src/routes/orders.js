"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// Get user orders
router.get('/user/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const orders = await prisma.order.findMany({
            where: { userId: parseInt(userId) },
            include: { product: true },
            orderBy: { createdAt: 'desc' }
        });
        res.json({ success: true, orders });
    }
    catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch orders' });
    }
});
exports.default = router;
