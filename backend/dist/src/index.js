"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};

Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const guide_1 = __importDefault(require("./routes/guide"));
const scanner_1 = __importDefault(require("./routes/scanner"));
const marketplace_1 = __importDefault(require("./routes/marketplace"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Root Route
app.get('/', (req, res) => {
    res.send('Adarsh Dragon Fruit Farm API is live!');
});
// Routes
app.use('/api/guide', guide_1.default);
app.use('/api/scanner', scanner_1.default);
app.use('/api/marketplace', marketplace_1.default);
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Dragon Fruit Platform API is running.' });
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
