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

function runPrismaGenerate(args) {
  const command = process.platform === 'win32' ? 'npx.cmd' : 'npx';
  const result = spawnSync(command, args, { stdio: 'inherit' });
  return result.status ?? 1;
}

const nodeMajor = major(process.version);
const prismaMajor = major(readPrismaVersion());

if (nodeMajor < 22 && prismaMajor >= 7) {
  console.warn(
    `Detected Prisma ${prismaMajor} on Node.js ${process.version}. Falling back to Prisma 6 for client generation.`
  );

  const fallbackStatus = runPrismaGenerate(['prisma@6', 'generate']);

  if (fallbackStatus === 0) {
    process.exit(0);
  }

  if (hasGeneratedClient()) {
    console.warn(
      `Fallback generation failed, but an existing Prisma Client was found. Continuing with the generated client.`
    );
    process.exit(0);
  }

  console.error(
    'Could not generate Prisma Client on Node.js <22. Use Node.js 22+, or install Prisma 6 and run `npx prisma generate` again.'
  );
  process.exit(fallbackStatus);
}

process.exit(runPrismaGenerate(['prisma', 'generate']));
