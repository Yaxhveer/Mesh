import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import authRoute from './routes/auth.js'
import profileRoute from './routes/profile.js'
import postRoute from './routes/post.js'
import { createPost } from './controllers/post.js';
import { editProfile } from './controllers/profile.js';
import { verifyToken } from './middleware/verifyToken.js';
import { body } from 'express-validator';

dotenv.config();

const PORT = process.env.PORT || 8080
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(cors({
  credentials: true
}));
app.use(cookieParser())
app.use(morgan('dev'));
app.use(bodyParser.json({ limit: "50mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use("/public/assets", express.static(path.join(__dirname, "public/assets")));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

app.post(
  '/post/create', 
  verifyToken, 
  body("userID").notEmpty().withMessage("User id missing"), 
  upload.single("post"), 
  createPost
);

app.post(
  '/profile/edit', 
  verifyToken, 
  body("userID").notEmpty().withMessage("User id missing"), 
  body("userName").notEmpty().withMessage("Username missing"),
  body("displayName").notEmpty().withMessage("Display name missing"),
  upload.single("avatar"), 
  editProfile
);

app.use('/auth', authRoute);
app.use('/post', postRoute);
app.use('/profile', profileRoute);

app.listen(PORT, ()=>{
    console.log(`Server started at http://localhost:${PORT}`);
})