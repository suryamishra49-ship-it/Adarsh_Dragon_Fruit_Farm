"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// Get recent activity updates (Public)
router.get('/', async (req, res) => {
    try {
        const activities = await prisma.activity.findMany({
            orderBy: { date: 'desc' },
            take: 5
        });
        res.json({ success: true, activities });
    }
    catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch activities' });
    }
});
// Get system activity logs (Admin only)
router.get('/logs', async (req, res) => {
    try {
        const logs = await prisma.activityLog.findMany({
            orderBy: { createdAt: 'desc' },
            include: { user: { select: { name: true, email: true } } },
            take: 50
        });
        res.json({ success: true, logs });
    }
    catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch logs' });
    }
});
exports.default = router;
