import { fetchGithubUser } from './services/githubAPI';
import { insertUser, userExists, displayAllUsers, listUsersFromLocation } from './db/dbFunctions';

const main = async () => {
  const args = process.argv.slice(2);
  
  switch(args[0]) {
    case 'fetch':
      const username = args[1];
      const user = await fetchGithubUser(username);
      console.log("Success - Fetched user: ", user);

      if (!(await userExists(user.id))) {
        await insertUser(user);
      } else {
        console.log(`User with GitHub ID ${user.id} already exists in the database and will not be added.`);
      }
      break;
    case 'display':
      const users = await displayAllUsers();
      console.log('All Users:', users);
      break;
    case 'list-from-location':
      const location = args[1];
      const usersFromLocation = await listUsersFromLocation(location);
      console.log(`Users from ${location}:`, usersFromLocation);
      break;
  }
};

main().catch(console.error);