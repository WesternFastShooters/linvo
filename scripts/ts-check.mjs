import { spawnSync } from 'node:child_process';

const rootDir = process.cwd();
const tscArgs = ['tsc', '-p', 'tsconfig.typecheck.json', ...process.argv.slice(2)];

function main() {
  const result = spawnSync('yarn', tscArgs, {
    cwd: rootDir,
    stdio: 'inherit',
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

main();
