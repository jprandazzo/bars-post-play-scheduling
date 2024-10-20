const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const inquirer = require('inquirer');

// Utility function to run shell commands
const run = (command, args = [], options = {}) => {
    const { status, error } = spawnSync(command, args, { stdio: 'inherit', ...options });
    if (status !== 0) {
        console.error(`Command failed: ${command} ${args.join(' ')}`);
        console.error(error);
        process.exit(1);
    }
};

// Read and parse package.json
const packageJson = JSON.parse(fs.readFileSync('./package.json'));
const currentVersion = packageJson.version;

// Get the current Git branch
const getCurrentBranch = () => spawnSync('git', ['rev-parse', '--abbrev-ref', 'HEAD'], { encoding: 'utf-8' }).stdout.trim();

// Check if there are uncommitted changes
const hasUncommittedChanges = () => {
    const result = spawnSync('git', ['diff-index', '--quiet', 'HEAD', '--']);
    return result.status !== 0;
};

// Get commit messages since the last deploy, excluding "Deploy version" commits
const getLastDeployCommit = () => {
    const gitLog = spawnSync('git', ['log', '--pretty=format:%H %s'], { encoding: 'utf-8' }).stdout.trim();
    const deployCommit = gitLog
        .split('\n')
        .find(commitLine => commitLine.toLowerCase().includes('deploy version'));

    if (deployCommit) {
        const [commitHash] = deployCommit.split(' ');
        return commitHash;
    }
    return null;
};

const getCommitsSinceLastDeploy = () => {
    const lastDeployCommit = getLastDeployCommit();

    if (!lastDeployCommit) {
        // No previous deploy found, return all commits
        return spawnSync('git', ['log', '--oneline'], { encoding: 'utf-8' }).stdout.trim();
    }

    // Fetch commits since the last deploy
    return spawnSync('git', ['log', `${lastDeployCommit}..HEAD`, '--oneline'], { encoding: 'utf-8' }).stdout.trim();
};

// Bump version based on selection
const bumpVersion = (version, bumpType) => {
    const [major, minor, patch] = version.split('.').map(Number);
    switch (bumpType) {
        case 'patch': return `${major}.${minor}.${patch + 1}`;
        case 'minor': return `${major}.${minor + 1}.0`;
        case 'major': return `${major + 1}.0.0`;
        default: throw new Error(`Unknown bump type: ${bumpType}`);
    }
};

// Open a temp file in VS Code and return the path
const createTempReleaseNotesFile = (commits) => {
    const tempFile = path.join(os.tmpdir(), `release_notes_${Date.now()}.md`);
    const initialContent = `# Release Notes\n\n${commits.split('\n').map(commit => `- ${commit}`).join('\n')}`;
    fs.writeFileSync(tempFile, initialContent, 'utf-8');
    return tempFile;
};

// Start deployment process
const startDeployment = async (bumpArg) => {
    const currentBranch = getCurrentBranch();
    if (currentBranch !== 'main') {
        console.error(`Please switch to the 'main' branch (current: ${currentBranch}).`);
        process.exit(1);
    }

    if (hasUncommittedChanges()) {
        console.error('You have uncommitted changes. Please commit or stash them before deploying.');
        process.exit(1);
    }

    const bumpOptions = ['patch', 'minor', 'major'];

    // Check if bumpArg is provided, else prompt
    const bumpType = bumpArg || (await inquirer.prompt({
        type: 'list',
        name: 'versionBump',
        message: 'Select version bump type:',
        choices: bumpOptions,
    })).versionBump;

    const newVersion = bumpVersion(currentVersion, bumpType);
    console.log(`Current version: ${currentVersion}`);
    console.log(`Bumping to: ${newVersion}`);

    // Get commit messages since last deploy
    const commits = getCommitsSinceLastDeploy();
    const tempFile = createTempReleaseNotesFile(commits);

    // Open the temp file in VS Code and wait until it is closed
    run('code', ['-w', tempFile]);

    // Read the edited release notes
    const releaseNotes = fs.readFileSync(tempFile, 'utf-8').trim();

    // Update the version in package.json
    packageJson.version = newVersion;
    fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2));

    // Commit the changes and create a Git tag
    run('git', ['add', 'package.json']);
    run('git', ['commit', '-m', `Deploy version ${newVersion}`]);
    run('git', ['push', 'origin', 'main']);
    run('git', ['tag', '-a', `v${newVersion}`, '-m', releaseNotes]);
    run('git', ['push', 'origin', `v${newVersion}`]);

    // Deploy to GitHub Pages
    run('npx', ['gh-pages', '-d', 'build']);

    console.log(`Deployment of version ${newVersion} successful!`);
};

// Check if bumpArg (patch/minor/major) is provided in the command
const bumpArg = process.argv[2];
startDeployment(bumpArg);
