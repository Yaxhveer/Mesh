import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'

dotenv.config();

export const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    if (token == null ) return res.status(401).json({done: false, msg: "Login Required"});

    jwt.verify(token, process.env.SECRET_TOKEN, (err, user) => {
        if (err) {
            console.log(err)
            return res.status(403)
        }
        req.user = user
        next()
    })
    
}