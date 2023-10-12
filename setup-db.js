import { config } from 'dotenv';
import pg from 'pg';

const { Pool } = pg;

config();

const user = process.env.DB_USER;
const password = process.env.DB_PASS;
const host = process.env.DB_HOST;
const port = process.env.DB_PORT;
const database = process.env.DB_NAME;

const connectionString = `postgres://${user}:${password}@${host}:${port}/postgres`; // Connect to the default database first

const pool = new Pool({
    connectionString: connectionString
});

pool.query(`SELECT 1 FROM pg_database WHERE datname='${database}'`, (err, res) => {
    if (err) {
        console.error('Error checking for database existence:', err);
        pool.end();
        return;
    }
    
    if (res.rowCount === 0) {
        pool.query(`CREATE DATABASE ${database}`, (creationErr, creationRes) => {
            if (creationErr) {
                console.error('Error creating database:', creationErr);
            } else {
                console.log('Database created successfully');
            }
            pool.end();
        });
    } else {
        console.log('Database already exists.');
        pool.end();
    }
});