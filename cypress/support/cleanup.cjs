// cypress/support/cleanup.cjs
// Utility to delete test users by email prefix (CommonJS version)

const { createClient } = require('@supabase/supabase-js');

// Read from environment or hardcode for local dev ONLY (never commit real secrets)
const SUPABASE_URL = process.env.SUPABASE_URL || 'YOUR_SUPABASE_URL';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || 'YOUR_SERVICE_ROLE_KEY';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

/**
 * Delete users from the auth.users and profiles tables whose email starts with the test prefix.
 * @param {string} prefix - Email prefix to match (e.g. 'testuser')
 */
async function cleanupTestUsers(prefix = 'testuser') {
  // 1. Find users in the profiles table with email like 'testuser%@example.com'
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('id, email')
    .ilike('email', `${prefix}%@example.com`);

  if (profilesError) throw profilesError;
  if (!profiles.length) return 0;

  const ids = profiles.map((u) => u.id);

  // 2. Delete from profiles
  const { error: deleteProfilesError } = await supabase
    .from('profiles')
    .delete()
    .in('id', ids);
  if (deleteProfilesError) throw deleteProfilesError;

  // 3. Delete from auth.users (requires service role key)
  for (const id of ids) {
    const { error: deleteAuthError } = await supabase.auth.admin.deleteUser(id);
    if (deleteAuthError) throw deleteAuthError;
  }

  return ids.length;
}

if (require.main === module) {
  // Run cleanup if called directly
  cleanupTestUsers(process.argv[2] || 'testuser')
    .then((count) => {
      console.log(`Deleted ${count} test users.`);
      process.exit(0);
    })
    .catch((err) => {
      console.error('Error cleaning up test users:', err);
      process.exit(1);
    });
}

module.exports = { cleanupTestUsers };
