import db from './db';

export const insertUser = async (user: any) => {
  return db.oneOrNone('INSERT INTO users(github_id, user_name, name, location) VALUES($1, $2, $3, $4) RETURNING id', [user.id, user.login, user.name, user.location]);
};

export const userExists = async (github_id: number): Promise<boolean> => {
  const user = await db.oneOrNone('SELECT * FROM users WHERE github_id = $1', [github_id]);
  return !!user;
};

export const displayAllUsers = async () => {
  return db.manyOrNone('SELECT * FROM users');
};

export const listUsersFromLocation = async (location: string) => {
  return db.manyOrNone('SELECT * FROM users WHERE location = $1', [location]);
};
