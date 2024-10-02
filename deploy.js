const { execSync } = require('node:child_process');
const fs = require('node:fs');
const readline = require('node:readline');

// Utility to run shell commands
const run = (command) => execSync(command, { stdio: 'inherit' });

// Read package.json to get current version
const packageJson = require('./package.json');
const currentVersion = packageJson.version;

// Setup readline for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Function to get the current Git branch
const getCurrentBranch = () => {
    return execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
};

// Function to check if there are uncommitted changes
const hasUncommittedChanges = () => {
    try {
        execSync('git diff-index --quiet HEAD --');
        return false;
    } catch {
        return true;
    }
};

// Start deployment process
const startDeployment = () => {
    const currentBranch = getCurrentBranch();
    if (currentBranch !== 'main') {
        console.error(`You are on branch ${currentBranch}. Please switch to the main branch.`);
        process.exit(1);
    }

    if (hasUncommittedChanges()) {
        console.error('You have uncommitted changes. Please commit or stash them before deploying.');
        process.exit(1);
    }

    console.log(`Current version: ${currentVersion}`);
    rl.question('Enter new version: ', (newVersion) => {
        if (!newVersion) {
            console.error('Version cannot be empty.');
            rl.close();
            process.exit(1);
        }

        // Run the build process
        console.log('Running build...');
        try {
            run('npm run build');
            console.log('Build successful!');
        } catch (error) {
            console.error('Build failed. Aborting deployment.');
            rl.close();
            process.exit(1);
        }

        // Update version in package.json
        packageJson.version = newVersion;
        fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2));

        // Commit version change and deploy
        try {
            run('git add package.json');
            run(`git commit -m "Deploy version ${newVersion}"`);
            run('git push origin main');
            run('npx gh-pages -d build');

            console.log(`Deployment of version ${newVersion} successful!`);
        } catch (error) {
            console.error('Deployment failed:', error);
        }

        rl.close();
    });
};

startDeployment();
