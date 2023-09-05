import pool from "../config/postgres.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const generateAcessToken = (userID) => {
    return jwt.sign({userID: userID}, process.env.SECRET_TOKEN, { expiresIn: '1d' });
}   

const transporter = nodemailer.createTransport({
     service: 'gmail',
     host: 'smtp.gmail.com',
     port: 465,
     secure: true,
     auth: { 
        user: process.env.USER, 
        pass: process.env.PASSCODE
    }});

const generateUserName = async(name) => {
    let userName = name;
    let number = 1;
    let flag = 0;
    while (flag) {
        userName = userName + number++;
        flag = await pool.query('SELECT EXISTS (SELECT from user_info where user_name = $1)', [name]);
    }
    console.log(userName);
    return userName;
}

export const register = async (req, res) => {
    const { email, password, name } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const userName = await generateUserName(name);
    const client = await pool.connect();
    console.log(name);
    try {
        await client.query("BEGIN");
        const flag = await client.query('SELECT EXISTS (SELECT from users where email = $1)',[email]);
        
        if(!flag.rows[0].exists){

            const user = await client.query('INSERT into users(email, password) values ($1, $2) RETURNING user_id;', [email, hash]);
            await client.query('INSERT INTO user_info (user_id, user_name, display_name) VALUES ($1, $2, $3)', [user.rows[0].user_id, userName, name]);
            const token = generateAcessToken(user.rows[0].user_id);

            var mailOptions = { 
                from: 'no-reply@example.com', 
                to: email, 
                subject: 'Successful login', 
                text: `Thank you for joining for becoming the part of our community\n`
            }; 

            transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    console.log(err);
                }
            })
        
            res.cookie('token', token, { 
                httpOnly: false, 
                secure: process.env.NODE_ENV !== "development"
            });
            res.json({ ...user.rows[0], token: token, done: 1 });
        } else {
            res.status(422).json({msg: "account already exists", done: 0});
        }

        await client.query('COMMIT');
    } catch (e) {
        console.log(e.message);
        await client.query("ROLLBACK");
        res.status(500).json({msg: e.message, done: 0});
    } finally {
        client.release();
    }
};

export const login = async (req, res) => {
    console.log(req.body);
    const {email, password} = req.body;
    try {
        const user = await pool.query('SELECT * from users where email = $1', [email]);

        if (user.rows.length === 0){
            console.log("Account don't exists ");
            res.status(422).json({msg: "Account does not exists", done: 0});
        } else {
            const verify = await bcrypt.compare(password, user.rows[0].password);
            if (verify) {
                console.log("user succesfully logged in.");
                const token = generateAcessToken(user.rows[0].user_id);
                res.cookie('token', token, {
                    httpOnly: false,
                    secure: process.env.NODE_ENV !== "development"
                });
                res.json({ ...user.rows[0], token: token, done: 1 });
            } else {
                console.log("incorrect password");
                res.status(422).json({msg: "incorrect password", done: 0});
            }         
        }
    } catch (e) {
        console.log(e.message);
        res.status(500).json({msg: e.msg, done: 0});
    }
};

export const logout = async (req, res) => {
    try {
        res.clearCookie("token").json({ data: "Successfully logged out", done: 1 });
    } catch (e) {
        console.log(e.message);
        res.status(500).json({msg: e.message, done: 0})
    } 
};

export const deleteAccount = async (req, res) => {
    const userID = req.userID;
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        await client.query('DELETE from users where user_id = $1;', [userID]);
        await client.query('COMMIT');
        res.status(201).json({done: 1});
    } catch (e) {
        console.log(e.message);
        await client.query('ROLLBACK');
        res.status(500).json({msg: e.message, done: 0});
    } finally {
        client.release();
    }
}