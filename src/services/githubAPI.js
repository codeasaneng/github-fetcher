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
exports.fetchUserLanguages = exports.fetchGithubUser = void 0;
const axios_1 = __importDefault(require("axios"));
const ramda_1 = require("ramda");
// Fetch a github user by user name (login)
const fetchGithubUser = (username) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield axios_1.default.get(`https://api.github.com/users/${username}`);
    return {
        id: (0, ramda_1.prop)('id', response.data),
        login: (0, ramda_1.prop)('login', response.data),
        name: (0, ramda_1.prop)('name', response.data),
        location: (0, ramda_1.prop)('location', response.data),
    };
});
exports.fetchGithubUser = fetchGithubUser;
// Fetch an user languages
const fetchUserLanguages = (username) => __awaiter(void 0, void 0, void 0, function* () {
    const repos = yield axios_1.default.get(`https://api.github.com/users/${username}/repos`);
    const languages = repos.data.map((repo) => repo.language);
    return Array.from(new Set(languages));
});
exports.fetchUserLanguages = fetchUserLanguages;
