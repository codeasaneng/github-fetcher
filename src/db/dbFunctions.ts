import db from './db';
import { DbUser, GithubUser } from '../services/githubAPI';

// Inserts a GitHub user into the database and returns the ID of the inserted user.
export const insertUser = async (user: GithubUser): Promise<number> => {
  const result = await db.one('INSERT INTO users(github_id, user_name, name, location) VALUES($1, $2, $3, $4) RETURNING id', [user.id, user.login, user.name, user.location]);
  return result.id;  // Return the ID of the newly inserted user
};

// Deletes a user by their GitHub ID from the database
export const deleteUserByGithubId = async (github_id: number): Promise<void> => {
  // First, delete any associated records in the user_languages table
  await db.none('DELETE FROM user_languages WHERE user_id = (SELECT id FROM users WHERE github_id = $1)', [github_id]);

  // Now, delete the user from the users table
  await db.none('DELETE FROM users WHERE github_id = $1', [github_id]);
};

// Checks if a user with the given GitHub ID already exists in the database.
export const userExists = async (github_id: number): Promise<boolean> => {
  const user = await db.oneOrNone('SELECT * FROM users WHERE github_id = $1', [github_id]);
  return !!user; // Return true if the user exists, false otherwise.
};

// Retrieves all users from the database.
export const displayAllUsers = async (): Promise<DbUser[]> => {
  return db.manyOrNone('SELECT * FROM users');
};

// Inserts a programming language into the database if it doesn't already exist.
export const insertLanguage = async (language: string): Promise<void> => {
  await db.none('INSERT INTO languages(language_name) VALUES($1) ON CONFLICT(language_name) DO NOTHING', [language]);
};

// Associates a user with a programming language in the database.
export const linkUserToLanguage = async (userId: number, language: string): Promise<void> => {
  await db.none('INSERT INTO user_languages(user_id, language_id) SELECT $1, id FROM languages WHERE language_name = $2', [userId, language]);
};

// Retrieves users based on provided location and/or programming language.
export const getUsersByLocationAndLanguage = async (location?: string | null, language?: string | null): Promise<DbUser[]> => {
  if (location && language) {
    return await db.manyOrNone(`
      SELECT DISTINCT users.* 
      FROM users 
      JOIN user_languages ON users.id = user_languages.user_id 
      JOIN languages ON user_languages.language_id = languages.id 
      WHERE users.location = $1 AND languages.language_name = $2`, 
      [location, language]
    );
  } else if (location) {
    return await db.manyOrNone('SELECT * FROM users WHERE location = $1', [location]);
  } else if (language) {
    return await db.manyOrNone(`
      SELECT DISTINCT users.* 
      FROM users 
      JOIN user_languages ON users.id = user_languages.user_id 
      JOIN languages ON user_languages.language_id = languages.id 
      WHERE languages.language_name = $1`,
      [language]
    );
  } else {
    return [];
  }
};