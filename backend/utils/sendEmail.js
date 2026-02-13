const nodemailer = require("nodemailer")

const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })

  await transporter.sendMail({
<<<<<<< HEAD
    from: `"TrustBus" <waylenbarreto@gmail.com>`,
=======
    from: `"TrustBus" <sheregarkarthik67@gmail.com>`,
>>>>>>> 4f3f6ea6c533369cc724f792361e360e86825758
    to,
    subject,
    text,
  })
}

module.exports = sendEmail
