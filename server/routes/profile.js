import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { getUser, follow, unfollow, getAllUsers, search, following, recommendation } from '../controllers/profile.js';
import { param, body } from 'express-validator';

const router = express.Router();

router.get(
    '/:userID', 
    verifyToken, 
    param("userID").notEmpty().withMessage("User id missing"), 
    getUser
);
router.post(
    '/follow', 
    verifyToken, 
    body("userID").notEmpty().withMessage("Current User id missing"), 
    body("otherID").notEmpty().withMessage("User id missing"), 
    follow
);
router.put(
    '/unfollow', 
    verifyToken, 
    body("userID").notEmpty().withMessage("Current User id missing"), 
    body("otherID").notEmpty().withMessage("User id missing"), 
    unfollow
);
router.get(
    '/users', 
    verifyToken, 
    getAllUsers
);
router.get(
    '/search/:key', 
    verifyToken, 
    param("key").notEmpty().withMessage("key missing"), 
    search
);
router.get(
    '/following/:userID', 
    verifyToken, 
    param("userID").notEmpty().withMessage("User id missing"), 
    following
);
router.get(
    '/recommendation/:userID', 
    verifyToken, 
    param("userID").notEmpty().withMessage("User id missing"), 
    recommendation
);

export default router;