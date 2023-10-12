import { main } from './index'
import * as githubAPI from './services/githubAPI';
import * as dbFunctions from './db/dbFunctions';

jest.mock('./services/githubAPI');
jest.mock('./db/dbFunctions');

describe('GitHub User Management', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  const mockedFetchGithubUser = githubAPI.fetchGithubUser as jest.Mock;
  const mockedFetchUserLanguages = githubAPI.fetchUserLanguages as jest.Mock;
  const mockedUserExists = dbFunctions.userExists as jest.Mock;
  const mockedInsertUser = dbFunctions.insertUser as jest.Mock;
  const mockedInsertLanguage = dbFunctions.insertLanguage as jest.Mock;
  const mockedDisplayAllUsers = dbFunctions.displayAllUsers as jest.Mock;
  const mockedGetUsersByLocationAndLanguage = dbFunctions.getUsersByLocationAndLanguage as jest.Mock;


  test('Fetch and insert a single GitHub user', async () => {
    const mockUser = {
      id: 1,
      login: 'testUser',
      name: 'Test User',
      location: 'Test City',
    };

    mockedFetchGithubUser.mockResolvedValueOnce(mockUser);
    mockedFetchUserLanguages.mockResolvedValueOnce(['JavaScript', 'TypeScript']);
    
    mockedUserExists.mockResolvedValueOnce(false);
    mockedInsertUser.mockResolvedValueOnce(1);

    process.argv = ['', '', 'fetch', 'testUser'];

    await main();

    expect(githubAPI.fetchGithubUser).toBeCalledWith('testUser');
    expect(dbFunctions.insertUser).toBeCalledWith(mockUser);
    expect(dbFunctions.insertLanguage).toBeCalledTimes(2);
  });

  test('Display all users', async () => {
    const mockUsers = [
      {
        id: 1,
        github_id: 1,
        user_name: 'testUser1',
        name: 'Test User 1',
        location: 'Location 1',
      },
      {
        id: 2,
        github_id: 2,
        user_name: 'testUser2',
        name: 'Test User 2',
        location: 'Location 2',
      },
    ];

    mockedDisplayAllUsers.mockResolvedValueOnce(mockUsers);

    process.argv = ['', '', 'display'];

    await main();

    expect(dbFunctions.displayAllUsers).toBeCalled();
  });

  test('List users by location and language', async () => {
    const mockUsers = [
      {
        id: 1,
        github_id: 1,
        user_name: 'testUser1',
        name: 'Test User 1',
        location: 'Location 1',
      }
    ];

    mockedGetUsersByLocationAndLanguage.mockResolvedValueOnce(mockUsers);

    process.argv = ['', '', 'list-from-location-and-or-language', 'Location 1', 'JavaScript'];

    await main();

    expect(dbFunctions.getUsersByLocationAndLanguage).toBeCalledWith('Location 1', 'JavaScript');
  });
});
