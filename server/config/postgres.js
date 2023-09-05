import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;
const connectionString = process.env.DB_URL;
const pool = new Pool ({ connectionString, });

export default pool;