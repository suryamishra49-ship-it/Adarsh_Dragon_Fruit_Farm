"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';
// Register
router.post('/register', async (req, res) => {
    const { email, password, name, role } = req.body;
    try {
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role: role || 'CUSTOMER'
            }
        });
        await prisma.activityLog.create({
            data: {
                userId: user.id,
                action: 'USER_REGISTERED',
                details: `New user ${email} registered.`
            }
        });
        res.status(201).json({ success: true, message: 'User created' });
    }
    catch (error) {
        res.status(400).json({ success: false, message: 'User already exists or invalid data' });
    }
});
// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user)
            return res.status(404).json({ success: false, message: 'User not found' });
        const validPassword = await bcryptjs_1.default.compare(password, user.password);
        if (!validPassword)
            return res.status(401).json({ success: false, message: 'Invalid password' });
        const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
        await prisma.activityLog.create({
            data: {
                userId: user.id,
                action: 'USER_LOGIN',
                details: `User ${user.email} logged in.`
            }
        });
        res.json({
            success: true,
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Login failed' });
    }
});
exports.default = router;
