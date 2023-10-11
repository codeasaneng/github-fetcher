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
Object.defineProperty(exports, "__esModule", { value: true });
const githubAPI_1 = require("./services/githubAPI");
const dbFunctions_1 = require("./db/dbFunctions");
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const args = process.argv.slice(2);
    switch (args[0]) {
        case 'fetch':
            const username = args[1];
            const user = yield (0, githubAPI_1.fetchGithubUser)(username);
            console.log("Success - Fetched user: ", user);
            if (!(yield (0, dbFunctions_1.userExists)(user.id))) {
                yield (0, dbFunctions_1.insertUser)(user);
            }
            else {
                console.log(`User with GitHub ID ${user.id} already exists in the database and will not be added.`);
            }
            break;
    }
});
main().catch(console.error);
