const nodemailer = require("nodemailer");



const sendMail = async ({clientEmail,html}) => {

  const transporter = nodemailer.createTransport({
    host: "smtp.zoho.in",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  const mailOptions = {
    from: `"SD Freelance" <${process.env.EMAIL}>`,
    to: clientEmail,
    subject: "Invoice",
    html: html, // ✅ Use the correct variable
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendMail;
