import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { fetchGithubUser, fetchUserLanguages } from './githubAPI';

const mock = new MockAdapter(axios);

describe('githubAPI', () => {

  describe('fetchGithubUser', () => {
    it('should fetch a GitHub user by username', async () => {
      const mockUserData = {
        id: 1,
        login: 'testuser',
        name: 'Test User',
        location: 'Testland'
      };
      
      mock.onGet('https://api.github.com/users/testuser').reply(200, mockUserData);
      
      const result = await fetchGithubUser('testuser');
      
      expect(result).toEqual(mockUserData);
    });
  });

  describe('fetchUserLanguages', () => {
    it('should fetch user languages by username', async () => {
      const mockReposData = [
        { language: 'JavaScript' },
        { language: 'TypeScript' },
        { language: 'JavaScript' }
      ];

      mock.onGet('https://api.github.com/users/testuser/repos').reply(200, mockReposData);

      const result = await fetchUserLanguages('testuser');

      expect(result).toEqual(['JavaScript', 'TypeScript']);
    });
  });

});

