// /api/update-notification-preferences.js
// Express-style handler for updating user notification preferences

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const token = req.cookies['sb-access-token'] || req.headers['authorization']?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Not authenticated' });

    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) return res.status(401).json({ error: 'Invalid user session' });

    const { emailNotifications, inAppNotifications } = req.body;
    if (typeof emailNotifications !== 'boolean' || typeof inAppNotifications !== 'boolean') {
      return res.status(400).json({ error: 'Invalid preferences' });
    }

    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        email_notifications: emailNotifications,
        in_app_notifications: inAppNotifications,
      })
      .eq('id', user.id);
    if (updateError) throw updateError;

    return res.status(200).json({ message: 'Preferences updated successfully' });
  } catch (error) {
    console.error('Update notification preferences error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
};
