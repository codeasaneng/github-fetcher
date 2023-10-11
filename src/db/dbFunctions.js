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
exports.getUsersByLocationAndLanguage = exports.linkUserToLanguage = exports.insertLanguage = exports.displayAllUsers = exports.userExists = exports.insertUser = void 0;
const db_1 = __importDefault(require("./db"));
// Inserts a GitHub user into the database and returns the ID of the inserted user.
const insertUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield db_1.default.one('INSERT INTO users(github_id, user_name, name, location) VALUES($1, $2, $3, $4) RETURNING id', [user.id, user.login, user.name, user.location]);
    return result.id; // Return the ID of the newly inserted user
});
exports.insertUser = insertUser;
// Checks if a user with the given GitHub ID already exists in the database.
const userExists = (github_id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield db_1.default.oneOrNone('SELECT * FROM users WHERE github_id = $1', [github_id]);
    return !!user; // Return true if the user exists, false otherwise.
});
exports.userExists = userExists;
// Retrieves all users from the database.
const displayAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    return db_1.default.manyOrNone('SELECT * FROM users');
});
exports.displayAllUsers = displayAllUsers;
// Inserts a programming language into the database if it doesn't already exist.
const insertLanguage = (language) => __awaiter(void 0, void 0, void 0, function* () {
    yield db_1.default.none('INSERT INTO languages(language_name) VALUES($1) ON CONFLICT(language_name) DO NOTHING', [language]);
});
exports.insertLanguage = insertLanguage;
// Associates a user with a programming language in the database.
const linkUserToLanguage = (userId, language) => __awaiter(void 0, void 0, void 0, function* () {
    yield db_1.default.none('INSERT INTO user_languages(user_id, language_id) SELECT $1, id FROM languages WHERE language_name = $2', [userId, language]);
});
exports.linkUserToLanguage = linkUserToLanguage;
// Retrieves users based on provided location and/or programming language.
const getUsersByLocationAndLanguage = (location, language) => __awaiter(void 0, void 0, void 0, function* () {
    if (location && language) {
        return yield db_1.default.manyOrNone(`
      SELECT DISTINCT users.* 
      FROM users 
      JOIN user_languages ON users.id = user_languages.user_id 
      JOIN languages ON user_languages.language_id = languages.id 
      WHERE users.location = $1 AND languages.language_name = $2`, [location, language]);
    }
    else if (location) {
        return yield db_1.default.manyOrNone('SELECT * FROM users WHERE location = $1', [location]);
    }
    else if (language) {
        return yield db_1.default.manyOrNone(`
      SELECT DISTINCT users.* 
      FROM users 
      JOIN user_languages ON users.id = user_languages.user_id 
      JOIN languages ON user_languages.language_id = languages.id 
      WHERE languages.language_name = $1`, [language]);
    }
    else {
        return [];
    }
});
exports.getUsersByLocationAndLanguage = getUsersByLocationAndLanguage;
