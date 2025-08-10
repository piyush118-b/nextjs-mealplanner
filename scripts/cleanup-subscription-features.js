const fs = require('fs');
const path = require('path');

// Files and directories to remove
const filesToRemove = [
  'app/api/check-subscription',
  'app/api/profile/subscription-status',
  'app/api/profile/unsubscribe',
  'app/subscribe',
  'prisma/migrations/20250109162220_add_stripe_subscription_unique',
  'lib/stripe.ts'
];

// Clean up files and directories
filesToRemove.forEach(filePath => {
  const fullPath = path.join(process.cwd(), filePath);
  if (fs.existsSync(fullPath)) {
    console.log(`Removing: ${filePath}`);
    fs.rmSync(fullPath, { recursive: true, force: true });
  } else {
    console.log(`Not found (skipping): ${filePath}`);
  }
});

console.log('\nCleanup complete!');
console.log('Please manually remove Stripe API keys from your .env file if they exist.');
