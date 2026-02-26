#!/usr/bin/env node

const { spawnSync } = require('node:child_process');
const { existsSync, readFileSync } = require('node:fs');

function major(version) {
  return Number(String(version).replace(/^v/, '').split('.')[0]);
}

function readPrismaVersion() {
  try {
    const pkg = JSON.parse(readFileSync(require.resolve('prisma/package.json'), 'utf8'));
    return pkg.version || '0.0.0';
  } catch {
    return '0.0.0';
  }
}

function hasGeneratedClient() {
  return existsSync('node_modules/.prisma/client/index.js');
}

const nodeMajor = major(process.version);
const prismaMajor = major(readPrismaVersion());

if (nodeMajor < 22 && prismaMajor >= 7) {
  if (hasGeneratedClient()) {
    console.warn(
      `Skipping \`prisma generate\`: Prisma ${prismaMajor} requires Node.js 22+ for generation in this setup, but current runtime is ${process.version}. Using already-generated client.`
    );
    process.exit(0);
  }

  console.error(
    `Cannot run \`prisma generate\` with Prisma ${prismaMajor} on ${process.version}. Please use Node.js 22+ or pin Prisma to v6.`
  );
  process.exit(1);
}

const command = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const result = spawnSync(command, ['prisma', 'generate'], { stdio: 'inherit' });
process.exit(result.status ?? 1);
