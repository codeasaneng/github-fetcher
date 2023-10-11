"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userExists = exports.insertUser = void 0;
const db_1 = __importDefault(require("./db"));
const insertUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    return db_1.default.oneOrNone('INSERT INTO users(github_id, user_name, name, location) VALUES($1, $2, $3, $4) RETURNING id', [user.id, user.login, user.name, user.location]);
});
exports.insertUser = insertUser;
const userExists = (github_id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield db_1.default.oneOrNone('SELECT * FROM users WHERE github_id = $1', [github_id]);
    return !!user;
});
exports.userExists = userExists;
