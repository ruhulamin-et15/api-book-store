const nodemailer = require("nodemailer");
const { smtpUserName, smtpPassword } = require("../secret");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: smtpUserName,
    pass: smtpPassword,
  },
});

const emailWithNodeMail = async (emailData) => {
  try {
    const mailOptions = {
      from: smtpUserName,
      to: emailData.email,
      subject: emailData.subject,
      html: emailData.html,
    };
    const info = await transporter.sendMail(mailOptions);
    console.log(`message sent: %s`, info.response);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { emailWithNodeMail };
