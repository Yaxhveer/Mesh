import pool from "../config/postgres.js";

export const getUser = async (req, res) => {
    const { userID } = req.params;

    try {
        const user = await pool.query('SELECT * from user_info where user_id = $1;', [userID]);
        let followers = await pool.query('Select user_id from following where following_id = $1;', [userID]);
        let following = await pool.query('Select following_id from following where user_id = $1;', [userID]);

        following = following.rows.map((user) => user.following_id);
        followers = followers.rows.map((user) => user.user_id);

        const data = {...user.rows[0], followers: followers, following: following};
        console.log(data);

        res.status(200).json({data: data, done: 1});
    } catch (e) {
        console.log(e.message);
        res.status(404).json({msg: e.message, done: 0});
    }
};

export const follow = async (req, res) => {
    const { userID, otherID } = req.body;

    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        await client.query('INSERT INTO following( user_id, following_id ) values ($1, $2);', [userID, otherID]);
        await client.query('COMMIT');
        res.status(201).json({done: 1});
    } catch (e) {
        console.log(e.message);
        await client.query('ROLLBACK');
        res.status(409).json({msg: e.message, done: 0});
    } finally {
        client.release();
    }
};

export const unfollow = async (req, res) => {
    const { userID, otherID } = req.body;

    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        await client.query('DELETE from following where user_id = $1 AND following_id = $2;', [userID, otherID]);
        await client.query('COMMIT');
        res.status(201).json({done: 1});
    } catch (e) {
        console.log(e.message);
        await client.query('ROLLBACK');
        res.status(409).json({msg: e.message, done: 0});
    } finally {
        client.release();
    }
};

export const editProfile = async (req, res) => {
    const { userID, userName, displayName, about } = req.body;
    const avatar = req?.file?.path;
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const flag = await client.query('SELECT EXISTS (SELECT from user_info where user_name = $1 AND user_id != $2 );', [userName, userID]);
        if (!flag.rows[0].exists) {
            const userInfo = avatar ? await client.query('INSERT INTO user_info (user_id, user_name, avatar, display_name, about) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (user_id) DO UPDATE SET user_name = excluded.user_name, display_name = excluded.display_name, avatar = excluded.avatar, about = excluded.about RETURNING *;', [userID, userName, avatar, displayName, about]) 
                                    : await client.query('INSERT INTO user_info (user_id, user_name, display_name, about) VALUES ($1, $2, $3, $4) ON CONFLICT (user_id) DO UPDATE SET user_name = excluded.user_name, display_name = excluded.display_name, about = excluded.about RETURNING *;', [userID, userName, displayName, about]);
            res.status(201).json({data: userInfo.rows[0], done: 1});
        } else {
            console.log("USERNAME not available.");
            res.status(409).json({msg: "USERNAME not available.", done: 0});
        }
        await client.query('COMMIT');
    } catch (e) {
        console.log(e.message);
        await client.query('ROLLBACK');
        res.status(409).json({msg: e.message, done: 0});
    } finally {
        client.release()
    }
}

export const getAllUsers = async (req, res) => {
    try {
        const users = await pool.query('SELECT * from users;', []); 
        res.status(200).json({data: users.rows, done: 1});
    } catch (e) {
        console.log(e.message);
        res.status(404).json({msg: e.message, done: 0});
    }
}

export const search = async (req, res) => {
    const { key } = req.params;
    try {
        const users = await pool.query('SELECT from users where user_name like $1 or display_name like $1;', [`%${key}%`]);
        res.status(200).json({data: users.rows, done: 1});
    } catch (e) {
        console.log(e.message);
        res.status(404).json({msg: e.message, done: 0});
    }
}

export const following = async (req, res) => {
    const { userID } = req.params;
    
    try {
        const data = await pool.query('SELECT * from user_info where user_id in (SELECT following_id from following where user_id = $1);', [userID]);
        res.status(200).json({data: data.rows, done: 1});
    } catch (e) {
        console.log(e.message);
        res.status(404).json({msg: e.message, done: 0});
    }
}

export const recommendation = async (req, res) => {
    const { userID } = req.params;
    
    try {
        const data = await pool.query('SELECT * from user_info where user_id not in (SELECT following_id from following where user_id = $1);', [userID]);
        res.status(200).json({data: data.rows, done: 1});
    } catch (e) {
        console.log(e.message);
        res.status(404).json({msg: e.message, done: 0});
    }
}