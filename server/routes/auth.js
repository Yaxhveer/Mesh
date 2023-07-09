import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { register, login, logout, deleteAccount } from '../controllers/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', verifyToken, logout);
router.get('/delete', verifyToken, deleteAccount);

export default router;