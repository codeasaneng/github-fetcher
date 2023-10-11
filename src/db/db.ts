const pgPromise = require('pg-promise');

const pgp = (pgPromise as any)();
const db = pgp('postgres://postgres:postgres@localhost:5432/postgres');

export default db;

