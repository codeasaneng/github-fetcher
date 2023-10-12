import { config } from 'dotenv';
import pg from 'pg';
import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

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
        pool.query(`CREATE DATABASE ${database}`, (creationErr) => {
            if (creationErr) {
                console.error('Error creating database:', creationErr);
            } else {
                console.log('Database created successfully');
                runMigrations();  // Run migrations after creating the database
            }
            pool.end();
        });
    } else {
        console.log('Database already exists.');
        runMigrations();  // Run migrations if the database already exists
        pool.end();
    }
});

function runMigrations() {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const migrateFilePath = path.join(__dirname, 'src', 'migrations', 'migrate.sql');
    const command = `psql -U ${user} -d postgres -a -f ${migrateFilePath}`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Migration error: ${error.message}`);
            return;
        }

        if (stderr) {
            console.error(`Migration stderr: ${stderr}`);
            return;
        }

        console.log(`Migration stdout: ${stdout}`);
    });
}