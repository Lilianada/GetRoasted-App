// utils/sendpulse.js
const sendpulse = require('@sendpulse/sendpulse-api');

const SENDPULSE_USER_ID = process.env.SENDPULSE_USER_ID;
const SENDPULSE_SECRET = process.env.SENDPULSE_SECRET;
const SENDPULSE_TOKEN_STORAGE = '/tmp/sendpulse_token.json';

sendpulse.init(SENDPULSE_USER_ID, SENDPULSE_SECRET, SENDPULSE_TOKEN_STORAGE);

function sendReminderEmail({email, name, reminder_text, templateId}) {
  return new Promise((resolve, reject) => {
    const variables = {
      name,
      reminder_text,
      unsubscribe: 'https://yourdomain.com/unsubscribe' // Replace with actual unsubscribe link logic
    };
    sendpulse.smtpSendMail(
      function(data) {
        if (data.result) resolve(data);
        else reject(data);
      },
      {
        html: '', // Not needed when using template
        text: '',
        subject: 'Reminder',
        from: {
          name: 'GetRoastedOnline',
          email: 'no-reply@getroastedonline.com',
        },
        to: [
          {
            email,
            name,
          },
        ],
        template: {
          id: templateId,
          variables,
        },
      }
    );
  });
}

module.exports = { sendReminderEmail };
