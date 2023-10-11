"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pgPromise = require('pg-promise');
const pgp = pgPromise();
const db = pgp('postgres://postgres:postgres@localhost:5432/postgres');
exports.default = db;
