import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { like, unlike, comment, uncomment, getComments, deletePost, getUserAllPost, feed, followingFeed } from '../controllers/post.js';
import { param, body } from 'express-validator';

const router = express.Router();

router.post(
    '/like', 
    verifyToken, 
    body("userID").notEmpty().withMessage("User id missing"), 
    body("postID").notEmpty().withMessage("Post id missing"), 
    like
);
router.put(
    '/unlike', 
    verifyToken, 
    body("userID").notEmpty().withMessage("User id missing"), 
    body("postID").notEmpty().withMessage("Post id missing"), 
    unlike
);
router.post(
    '/comment', 
    verifyToken, 
    body("userID").notEmpty().withMessage("User id missing"), 
    body("postID").notEmpty().withMessage("Post id missing"), 
    body("comment").notEmpty().withMessage("Comment missing"), 
    comment
);
router.put(
    '/uncomment', 
    verifyToken, 
    body("userID").notEmpty().withMessage("User id missing"), 
    body("postID").notEmpty().withMessage("Post id missing"), 
    uncomment
);
router.get(
    '/comments/:postID', 
    verifyToken, param("postID").notEmpty().withMessage("Post id missing"), 
    getComments
);
router.delete(
    '/delete/:postID', 
    verifyToken, 
    param("postID").notEmpty().withMessage("Post id missing"), 
    deletePost
);
router.get(
    '/:userID', 
    verifyToken, 
    param("userID").notEmpty().withMessage("User id missing"), 
    getUserAllPost
);
router.get(
    '/followingFeed/:userID', 
    verifyToken, 
    param("userID").notEmpty().withMessage("User id missing"), 
    followingFeed
);
router.get(
    '/feed/:userID', 
    verifyToken, 
    param("userID").notEmpty().withMessage("User id missing"), 
    feed
);

export default router;