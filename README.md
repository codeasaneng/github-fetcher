# GitHub Fetcher CLI Application

This command-line application allows users to fetch GitHub user data and store it into a PostgreSQL database. Additionally, you can display the fetched users and filter them based on location and programming language.

## Setup and Installation

### 1. Clone the Repository:

    git clone https://github.com/codeasaneng/github-fetcher.git

### 2. Install dependencies:

Navigate to the root of the project and run:

    npm install

### 3. Install PostgreSQL (MAC):

Install PostgreSQL using Homebrew:

    brew install postgres

If you encounter an issue related to an outdated formula, tap into the Homebrew core:

    brew tap home-brew/core

And then run again:

    brew install postgres

### 3. Start PostgreSQL Service (MAC):

Start the Postgres service by running:

    brew services start postgresql

Attempt to access PostgreSQL:

    psql -U postgres -d postgres

If the above command fails, identify your system's username, by running in the command-line:

    whoami

Then, try accessing PostgreSQL with that username:

    psql -U "output_of_whoami" -d postgres

If you have access with your system's username but not with postgres, update the .env file in the project root to use this username.

### 4. Setup the Database:

On the root of the project run:

    node setup-db.mjs

And expect the output (success case):

        Migration stdout: 
        CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        github_id INT UNIQUE NOT NULL,
        user_name TEXT NOT NULL,
        name TEXT,
        location TEXT
        );
        CREATE TABLE
        CREATE TABLE languages (
        id SERIAL PRIMARY KEY,
        language_name TEXT UNIQUE
        );
        CREATE TABLE
        CREATE TABLE user_languages (
        user_id INT REFERENCES users(id),
        language_id INT REFERENCES languages(id),
        PRIMARY KEY (user_id, language_id)
        );
        CREATE TABLE

## How to use the app

Run the next commands inside the src folder where is located the index.js file

1. **Fetch a Single GitHub User**:

    ```bash
    node index.js fetch [username]
    ```

    This fetches and displays a GitHub user based on the provided username and stores it in the database along with their associated programming languages.

2. **Display All Fetched Users**:

    ```bash
    node index.js display
    ```

    This displays all users that have been fetched and stored in the database.

3. **List Users Based on Location and/or Programming Language**:

    - By Location:
        ```
        node index.js list-from-location-and-or-language [location]
        ```

    - By Language:
        ```
        node index.js list-from-location-and-or-language null [language]
        ```

    - By Both Location and Language:
        ```
        node index.js list-from-location-and-or-language [location] [language]
        ```
    
    This lists users based on the provided location and/or programming language.

    Remember to replace `[username]`, `[location]`, and `[language]` with appropriate values when running the commands.

## Run tests

### 1. Unit (jest) tests:

On the root of the project run:

    npm run unit-tests

Results will be displayed like:

    Test Suites: 3 passed, 3 total
    Tests:       12 passed, 12 total
    Snapshots:   0 total
    Time:        3.26 s
    Ran all test suites.

### 2. E2E test:

On the root of the project run:

    npm test
