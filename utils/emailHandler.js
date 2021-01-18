const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  var transport = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: 'be9929b70dd679',
      pass: '892ff6656bb4a9',
    },
  });

  const mailOptions = {
    from: 'Scankar Admin <admin@scankar.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    //html:
  };
  const info = await transport.sendMail(mailOptions);
  console.log('Message sent: %s', info.messageId);
};

module.exports = sendEmail;
