// /api/send-reminder-email.js
// Express-style handler to send a reminder email using SendPulse

const { sendReminderEmail } = require('../utils/sendpulse');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, name, reminder_text, templateId } = req.body;
    if (!email || !name || !reminder_text || !templateId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    await sendReminderEmail({ email, name, reminder_text, templateId });
    return res.status(200).json({ message: 'Reminder email sent' });
  } catch (error) {
    console.error('SendPulse email error:', error);
    return res.status(500).json({ error: error.message || 'Failed to send email' });
  }
};
