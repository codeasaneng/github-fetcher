import * as dbFunctions from './dbFunctions';
import db from './db';
import { GithubUser, DbUser } from '../services/githubAPI';

jest.mock('./db');

describe('dbFunctions', () => {

  const mockGithubUser: GithubUser = {
    id: 123,
    login: 'testuser',
    name: 'Test User',
    location: 'Testland',
  };

  const mockDbUser: DbUser = {
    id: 456,
    github_id: 123,
    user_name: 'testuser',
    name: 'Test User',
    location: 'Testland',
  };

  describe('insertUser', () => {
    it('should insert a user and return its ID', async () => {
      (db.one as jest.Mock).mockResolvedValueOnce({ id: 456 });

      const id = await dbFunctions.insertUser(mockGithubUser);
      expect(id).toBe(456);
    });
  });

  describe('userExists', () => {
    it('should return true if a user exists', async () => {
      (db.oneOrNone as jest.Mock).mockResolvedValueOnce(mockDbUser);

      const exists = await dbFunctions.userExists(123);
      expect(exists).toBe(true);
    });

    it('should return false if a user does not exist', async () => {
      (db.oneOrNone as jest.Mock).mockResolvedValueOnce(null);

      const exists = await dbFunctions.userExists(123);
      expect(exists).toBe(false);
    });
  });

  describe('displayAllUsers', () => {
    it('should retrieve all users from the database', async () => {
      (db.manyOrNone as jest.Mock).mockResolvedValueOnce([mockDbUser]);

      const users = await dbFunctions.displayAllUsers();
      expect(users).toHaveLength(1);
      expect(users[0].id).toBe(456);
    });
  });

  describe('insertLanguage', () => {
    it('should insert a language if it does not exist', async () => {
      await dbFunctions.insertLanguage('TypeScript');
      expect(db.none).toHaveBeenCalledWith('INSERT INTO languages(language_name) VALUES($1) ON CONFLICT(language_name) DO NOTHING', ['TypeScript']);
    });
  });

  describe('linkUserToLanguage', () => {
    it('should associate a user with a programming language', async () => {
      await dbFunctions.linkUserToLanguage(456, 'TypeScript');
      expect(db.none).toHaveBeenCalledWith('INSERT INTO user_languages(user_id, language_id) SELECT $1, id FROM languages WHERE language_name = $2', [456, 'TypeScript']);
    });
  });

  describe('getUsersByLocationAndLanguage', () => {
    it('should retrieve users based on location and language', async () => {
      (db.manyOrNone as jest.Mock).mockResolvedValueOnce([mockDbUser]);

      const users = await dbFunctions.getUsersByLocationAndLanguage('Testland', 'TypeScript');
      expect(users).toHaveLength(1);
      expect(users[0].location).toBe('Testland');
      expect(users[0].id).toBe(456);
    });
  });
});

