import pool from "../config/postgres.js";

export const like = async (req, res) => {
    const { postID, userID } = req.body;
    console.log(req.body);
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        await client.query('INSERT into likes(post_id, user_id) values ($1, $2);',[postID, userID]);
        await client.query('COMMIT');
        res.status(201).json({done: 1});
    } catch (e) {
        console.log(e.message);
        await client.query('ROLLBACK');
        res.status(409).json({msg: e.message, done: 0});
    } finally {
        client.release();
    }
} 

export const unlike = async (req, res) => {
    const { postID, userID } = req.body;
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        await client.query('DELETE from likes where post_id = $1 and user_id = $2;',[postID, userID]);
        await client.query('COMMIT');
        res.status(201).json({done: 1});
    } catch (e) {
        console.log(e.message);
        await client.query('ROLLBACK');
        res.status(409).json({msg: e.message, done: 0});
    } finally {
        client.release();
    }
}

export const comment = async (req, res) => {
    const { postID, userID, comment } = req.body;
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        await client.query('INSERT into comments(post_id, user_id, comment) values ($1, $2, $3);',[postID, userID, comment]);
        await client.query('COMMIT');
        res.status(201).json({done: 1});
    } catch (e) {
        console.log(e.message);
        await client.query('ROLLBACK');
        res.status(409).json({msg: e.message, done: 0});
    } finally {
        client.release();
    }
} 

export const uncomment = async (req, res) => {
    const { postID, userID } = req.body;
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        await client.query('DELETE from comments where post_id = $1 and user_id = $2;',[postID, userID]);
        await client.query('COMMIT');
        res.status(201).json({done: 1});
    } catch (e) {
        console.log(e.message);
        await client.query('ROLLBACK');
        res.status(409).json({msg: e.message, done: 0});
    } finally {
        client.release();
    }
}

export const getComments = async (req, res) => {
    const { postID } = req.params;
    try{
        const data = await pool.query('SELECT t1.post_id, t2.user_name, t2.avatar, t1.comment from comments t1 join user_info t2 on t1.user_id=t2.user_id where t1.post_id = $1;', [postID]);
        res.status(200).json({data: data.rows, done: 1});
    } catch (e) {
        console.log(e.message);
        res.status(404).json({msg: e.message, done: 0});
    }
}

export const createPost = async (req, res) => {
    const { about, userID } = req.body;
    const post = req.file?.path;
    console.log(post);
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        await client.query('INSERT into posts(user_id, post, about) values ($1, $2, $3);', [userID, post, about]);
        await client.query('COMMIT');
        res.status(201).json({done: 1});
    } catch (e) {
        console.log(e.message);
        await client.query('ROLLBACK');
        res.status(409).json({msg: e.message, done: 0});
    } finally {
        client.release();
    }
}

export const deletePost = async (req, res) => {
    const { postID } = req.params;
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        await client.query('DELETE from posts where post_id = $1;', [postID]);
        await client.query('COMMIT');
        res.status(201).json({done: 1});
    } catch (e) {
        console.log(e.message);
        await client.query('ROLLBACK');
        res.status(409).json({msg: e.message, done: 0});
    } finally {
        client.release();
    }
}

export const getUserAllPost = async (req, res) => {
    const { userID } = req.params;
    try {
        const data = await pool.query('SELECT t1.post_id, post, t1.user_id, t1.about, COUNT(*) AS likes from posts t1 JOIN likes t2 ON t1.post_id = t2.post_id GROUP BY t1.post_id HAVING t1.user_id = $1 UNION SELECT post_id, post, user_id, about, 0 as likes FROM posts WHERE user_id = $1 and post_id not in (select post_id from likes) ORDER BY post_id DESC;', [userID]);
        const liked = await pool.query('SELECT post_id from likes where user_id = $1', [userID]);
        const likedPost = liked.rows.map((post) => post.post_id);
        res.status(200).json({data: data.rows, liked: likedPost, done: 1});
    } catch (e) {
        console.log(e.message);
        res.status(404).json({msg: e.message, done: 0});
    }
}

export const followingFeed = async (req, res) => {
    const { userID } = req.params;
    try {
        const data = await pool.query('SELECT t1.post_id, t1.user_id, t1.post, t1.about, COUNT(*) AS likes from posts t1 JOIN likes t2 ON t1.post_id = t2.post_id GROUP BY t1.post_id HAVING t1.user_id = ANY (SELECT following_id from following where user_id = $1 UNION SELECT $1) UNION SELECT post_id, user_id, post, about, 0 as likes FROM posts WHERE user_id = ANY(SELECT following_id from following where user_id = $1 UNION SELECT $1) and post_id not in (select post_id from likes) ORDER BY post_id DESC;', [userID])
        const liked = await pool.query('SELECT post_id from likes where user_id = $1', [userID]);
        const likedPost = liked.rows.map((post) => post.post_id);
        res.status(200).json({data: data.rows, liked: likedPost, done: 1});
    } catch (e) {
        console.log(e.message);
        res.status(404).json({msg: e.message, done: 0});
    }
}

export const feed = async (req, res) => {
    const { userID } = req.params;
    try {
        const data = await pool.query('SELECT t1.post_id, t1.user_id, post, t1.about, COUNT(*) AS likes from posts t1 JOIN likes t2 on t1.post_id = t2.post_id GROUP BY t1.post_id UNION SELECT post_id, user_id, post, about, 0 as likes FROM posts WHERE post_id not in (select post_id from likes) ORDER BY post_id DESC;')
        const liked = await pool.query('SELECT post_id from likes where user_id = $1', [userID]);
        const likedPost = liked.rows.map((post) => post.post_id);
        res.status(200).json({data: data.rows, liked: likedPost, done: 1});
    } catch (e) {
        console.log(e.message);
        res.status(404).json({msg: e.message, done: 0});
    }
}