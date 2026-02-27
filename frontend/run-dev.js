#!/usr/bin/env node

/**
 * Development server runner
 * This bypasses PowerShell execution policy issues
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('========================================');
console.log('Starting PrimeAcc Frontend Server');
console.log('========================================\n');

// Run next dev -p 3003
const next = spawn('node', [
  path.join(__dirname, 'node_modules', 'next', 'dist', 'bin', 'next'),
  'dev',
  '-p',
  '3003'
], {
  stdio: 'inherit',
  shell: false
});

next.on('error', (error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

next.on('close', (code) => {
  console.log(`\nServer process exited with code ${code}`);
  process.exit(code);
});

// Handle Ctrl+C
process.on('SIGINT', () => {
  console.log('\nShutting down server...');
  next.kill('SIGINT');
});
