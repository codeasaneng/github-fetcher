const { exec } = require('child_process');
const { deleteUserByGithubId } = require('../src/db/dbFunctions'); // Adjust the path as necessary

const runCommand = (command) => {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                return reject(error);
            }
            if (stderr) {
                return reject(new Error(stderr));
            }
            resolve(stdout);
        });
    });
};

describe('GitHub Fetcher', () => {

    beforeAll(async () => {
        try {
            // Attempt to delete user with ID 38 used in the test
            await deleteUserByGithubId(38);
        } catch (error) {
            console.error(`There is no user with github id 38 in database`);
        }
    });

    test('fetches and displays user', async () => {
        const fetchCommand = `node src/index.js fetch atmos`;
        const fetchOutput = await runCommand(fetchCommand);

        expect(fetchOutput).toContain(`Success - Fetched user:  { id: 38, login: 'atmos', name: 'Corey Donohoe', location: 'NYC ' }`);
        expect(fetchOutput).toContain(`User with GitHub ID 38 has been added to the database with local ID`);

        const displayCommand = `node src/index.js display`;
        const displayOutput = await runCommand(displayCommand);

        expect(displayOutput).toContain("GitHub ID: 38");
        expect(displayOutput).toContain("User Name: atmos");
        expect(displayOutput).toContain("Name: Corey Donohoe");
        expect(displayOutput).toContain("Location: NYC");
    }, 30000);
});
