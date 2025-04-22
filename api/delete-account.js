// /api/delete-account.js
// Express-style handler for deleting a user account securely

const { createClient } = require('@supabase/supabase-js');

// Environment variables for Supabase
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Create a Supabase client with service role for admin actions
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Authenticate the user (e.g., using a cookie or header with JWT)
    const token = req.cookies['sb-access-token'] || req.headers['authorization']?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Not authenticated' });

    // Get user info from JWT
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) return res.status(401).json({ error: 'Invalid user session' });

    // Delete user from auth
    const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id);
    if (deleteError) throw deleteError;

    // Optionally: delete user data from other tables
    // await supabase.from('profiles').delete().eq('id', user.id);
    // ...delete from other tables as needed...

    return res.status(200).json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Delete account error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
};
