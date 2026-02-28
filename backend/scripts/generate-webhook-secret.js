#!/usr/bin/env node

/**
 * Generate secure webhook secret for Sepay
 * 
 * Usage:
 *   node scripts/generate-webhook-secret.js
 */

const crypto = require('crypto');

function generateSecret(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}

console.log('\n🔐 Sepay Webhook Secret Generator\n');
console.log('Generated secrets (choose one):\n');

// Generate 3 options
for (let i = 1; i <= 3; i++) {
  const secret = generateSecret();
  console.log(`Option ${i}: ${secret}`);
}

console.log('\n📝 Instructions:');
console.log('1. Copy one of the secrets above');
console.log('2. Add to backend/.env:');
console.log('   SEPAY_WEBHOOK_SECRET="<paste_secret_here>"');
console.log('3. Add the SAME secret to Sepay Dashboard → Webhook Settings');
console.log('4. Restart backend: npm run start:dev\n');
