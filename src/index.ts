import { GithubUser, DbUser, fetchGithubUser, fetchUserLanguages } from './services/githubAPI';
import { insertUser, userExists, displayAllUsers, getUsersByLocationAndLanguage, insertLanguage, linkUserToLanguage} from './db/dbFunctions';
import { forEach } from 'ramda';

const main = async () => {
  // Retrieve command-line arguments
  const args = process.argv.slice(2);
  
  // Handle various command-line arguments to perform the corresponding actions
  switch(args[0] as 'fetch-all' | 'fetch' | 'display' | 'list-from-location-and-or-language') {
    // Case to fetch a single GitHub user based on the provided username
    case 'fetch':
      const username = args[1];
      const user: GithubUser = await fetchGithubUser(username);
      console.log("Success - Fetched user: ", user);

      let localUserId: number | null = null;

      // Check if user exists in the database
      if (!(await userExists(user.id))) {
        localUserId = await insertUser(user);
        console.log(`User with GitHub ID ${user.id} has been added to the database with local ID ${localUserId}.`);

        // Fetch and associate languages for the user
        const languages: string[] = await fetchUserLanguages(user.login);
        for (const language of languages) {
            await insertLanguage(language);
            if (localUserId) {
                await linkUserToLanguage(localUserId, language);
            }
        }
      } else {
          console.log(`User with GitHub ID ${user.id} already exists in the database and will not be processed again.`);
      }
      break;

    // Case to display all users stored in the database
    case 'display':
      const users: DbUser[] = await displayAllUsers();

      if(!(users.length > 0)) {
        console.log("There are no users fetched to be displayed.")
      } else {
        users.forEach(user => {displayUserFormat(user)});
      }
      break;

    // Case to list users based on location and/or programming languages
    case 'list-from-location-and-or-language':
      const location: string | null = args[1] || null;
      const language: string | null = args[2] || null;

      if (location == null && language == null) {
        console.log("No values were passed for location or language! Nothing to display!")
      } else {
        const users: DbUser[] = await getUsersByLocationAndLanguage(location, language);

        // Display based on provided parameters
        if (location && language) {
          console.log(`Users from ${location} who use the ${language} language:`);
        } else if (location) {
          console.log(`Users from ${location}:`);
        } else if (language) {
          console.log(`Users who use the ${language} language:`);
        }
        users.forEach(user => {displayUserFormat(user)});
      }
      break;
  }
};

// Helper function to format and display user details
const displayUserFormat = (user: DbUser) => {
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
}

main().catch(console.error);