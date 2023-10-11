CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  github_id INT UNIQUE NOT NULL,
  user_name TEXT NOT NULL,
  name TEXT,
  location TEXT
);

CREATE TABLE languages (
  id SERIAL PRIMARY KEY,
  language_name TEXT UNIQUE
);

CREATE TABLE user_languages (
  user_id INT REFERENCES users(id),
  language_id INT REFERENCES languages(id),
  PRIMARY KEY (user_id, language_id)
);
