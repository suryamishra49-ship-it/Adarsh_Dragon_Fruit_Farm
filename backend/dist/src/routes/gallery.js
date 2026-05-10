"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// Get gallery items
router.get('/', async (req, res) => {
    try {
        const items = await prisma.galleryItem.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json({ success: true, items });
    }
    catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch gallery' });
    }
});
exports.default = router;
