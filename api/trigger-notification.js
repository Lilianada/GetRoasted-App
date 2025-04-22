// /api/trigger-notification.js
// Usage: POST with { userId, title, message, type, actionUrl, userEmail, userName, templateId }

const { createClient } = require('@supabase/supabase-js');
const { sendReminderEmail } = require('../utils/sendpulse');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { userId, title, message, type, actionUrl, userEmail, userName, templateId } = req.body;
    if (!userId || !title || !message || !type) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    // Insert notification
    await supabase.from('notifications').insert([{
      user_id: userId,
      title,
      message,
      type,
      action_url: actionUrl,
    }]);
    // Fetch user notification preferences
    const { data: profile } = await supabase.from('profiles').select('email_notifications').eq('id', userId).single();
    if (profile?.email_notifications && userEmail && templateId) {
      await sendReminderEmail({
        email: userEmail,
        name: userName,
        reminder_text: message,
        templateId,
      });
    }
    return res.status(200).json({ message: 'Notification triggered' });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
};
