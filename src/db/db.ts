import pgPromise from 'pg-promise';
import { config } from 'dotenv';
import path from 'path';

const envPath = path.resolve(__dirname, '../../.env');
config({ path: envPath });

const pgp = (pgPromise as any)();

const user = process.env.DB_USER;
const password = process.env.DB_PASS;
const host = process.env.DB_HOST;
const port = process.env.DB_PORT;
const database = process.env.DB_NAME;

const connectionString = `postgres://${user}:${password}@${host}:${port}/${database}`;
const db = pgp(connectionString);

export default db;