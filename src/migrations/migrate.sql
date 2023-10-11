CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  github_id INT UNIQUE NOT NULL,
  user_name TEXT NOT NULL,
  name TEXT,
  location TEXT
);
