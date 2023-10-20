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
exports.main = void 0;
const githubAPI_1 = require("./services/githubAPI");
const dbFunctions_1 = require("./db/dbFunctions");
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    // Retrieve command-line arguments
    const args = process.argv.slice(2);
    // Handle various command-line arguments to perform the corresponding actions
    switch (args[0]) {
        // Case to fetch a single GitHub user based on the provided username
        case 'fetch':
            const username = args[1];
            const user = yield (0, githubAPI_1.fetchGithubUser)(username);
            console.log("Success - Fetched user: ", user);
            let localUserId = null;
            // Check if user exists in the database
            if (!(yield (0, dbFunctions_1.userExists)(user.id))) {
                localUserId = yield (0, dbFunctions_1.insertUser)(user);
                console.log(`User with GitHub ID ${user.id} has been added to the database with local ID ${localUserId}.`);
                // Fetch and associate languages for the user
                const languages = yield (0, githubAPI_1.fetchUserLanguages)(user.login);
                for (const language of languages) {
                    yield (0, dbFunctions_1.insertLanguage)(language);
                    if (localUserId) {
                        yield (0, dbFunctions_1.linkUserToLanguage)(localUserId, language);
                    }
                }
            }
            else {
                console.log(`User with GitHub ID ${user.id} already exists in the database and will not be processed again.`);
            }
            break;
        // Case to display all users stored in the database
        case 'display':
            const users = yield (0, dbFunctions_1.displayAllUsers)();
            if (!(users.length > 0)) {
                console.log("There are no users fetched to be displayed.");
            }
            else {
                users.forEach(user => { displayUserFormat(user); });
            }
            break;
        // Case to list users based on location and/or programming languages
        case 'list-from-location-and-or-language':
            const location = args[1] || null;
            const language = args[2] || null;
            if (location == null && language == null) {
                console.log("No values were passed for location or language! Nothing to display!");
            }
            else {
                const users = yield (0, dbFunctions_1.getUsersByLocationAndLanguage)(location, language);
                // Display based on provided parameters
                if (location && language) {
                    console.log(`Users from ${location} who use the ${language} language:`);
                }
                else if (location) {
                    console.log(`Users from ${location}:`);
                }
                else if (language) {
                    console.log(`Users who use the ${language} language:`);
                }
                users.forEach(user => { displayUserFormat(user); });
            }
            break;
    }
});
exports.main = main;
// Helper function to format and display user details
const displayUserFormat = (user) => {
    const id = user.id;
    const githubId = user.github_id || "No GitHub ID available";
    const userName = user.user_name || "No user name available";
    const name = user.name || "No name available";
    const location = user.location || "No location available";
    console.log(`
    ID: ${id}
    GitHub ID: ${githubId}
    User Name: ${userName}
    Name: ${name}
    Location: ${location}
  `);
};
(0, exports.main)().catch(console.error);
