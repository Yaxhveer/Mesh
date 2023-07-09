import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { like, unlike, comment, uncomment, getComments, deletePost, getUserAllPost, feed, followingFeed } from '../controllers/post.js';

const router = express.Router();

router.post('/like', verifyToken, like);
router.put('/unlike', verifyToken, unlike);
router.post('/comment', verifyToken, comment);
router.put('/uncomment', verifyToken, uncomment);
router.get('/comments/:postID', verifyToken, getComments);
router.delete('/delete/:postID', verifyToken, deletePost);
router.get('/:userID', verifyToken, getUserAllPost);
router.get('/followingFeed/:userID', verifyToken, followingFeed);
router.get('/feed/:userID', verifyToken, feed);

export default router;