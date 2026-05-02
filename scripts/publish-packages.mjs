import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, '..');

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');

const tagIndex = args.indexOf('--tag');
const tag = tagIndex >= 0 ? args[tagIndex + 1] : undefined;
const otpIndex = args.indexOf('--otp');
const otp = otpIndex >= 0 ? args[otpIndex + 1] : undefined;

if (tagIndex >= 0 && !tag) {
  console.error('Missing value for --tag');
  process.exit(1);
}

if (otpIndex >= 0 && !otp) {
  console.error('Missing value for --otp');
  process.exit(1);
}

const packages = [
  {
    name: '@whfzgyx/linvo-core',
    distDir: './packages/core/dist',
  },
  {
    name: '@whfzgyx/linvo-primitives',
    distDir: './packages/primitives/dist',
  },
  {
    name: '@whfzgyx/linvo-ui',
    distDir: './packages/ui/dist',
  },
  {
    name: '@whfzgyx/linvo-integrations',
    distDir: './packages/integrations/dist',
  },
];

function run(command, commandArgs, options = {}) {
  console.log(`\n> ${command} ${commandArgs.join(' ')}`);
  try {
    execFileSync(command, commandArgs, {
      cwd: rootDir,
      stdio: 'inherit',
      ...options,
    });
  } catch (error) {
    if (
      command === 'npm' &&
      commandArgs[0] === 'publish'
    ) {
      console.error('\nPublish failed.');
      console.error(
        'If npm asked for a one-time password, either complete the browser auth flow or use a granular npm token with bypass 2FA enabled.'
      );
      console.error(
        'If you use a token, make sure it has write access for the @whfzgyx scope.'
      );
    }
    throw error;
  }
}

run('npm', ['whoami']);

for (const pkg of packages) {
  run('yarn', ['workspace', pkg.name, 'build']);
}

for (const pkg of packages) {
  const publishArgs = ['publish', pkg.distDir, '--access', 'public'];

  if (tag) {
    publishArgs.push('--tag', tag);
  }

  if (otp) {
    publishArgs.push('--otp', otp);
  }

  if (dryRun) {
    publishArgs.push('--dry-run');
  }

  run('npm', publishArgs);
}
