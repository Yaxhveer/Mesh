import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { getUser, follow, unfollow, getAllUsers, search, following, recommendation } from '../controllers/profile.js';

const router = express.Router();

router.get('/:userID', verifyToken, getUser);
router.post('/follow', verifyToken, follow);
router.put('/unfollow', verifyToken, unfollow);
router.get('/users', verifyToken, getAllUsers);
router.get('/search/:key', verifyToken, search);
router.get('/following/:userID', verifyToken, following);
router.get('/recommendation/:userID', verifyToken, recommendation);

export default router;