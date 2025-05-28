// utils/mailer.js
const nodemailer = require('nodemailer');
// require("dotenv").config();
console.log("dotenv mail email: ",process.env.APP_EMAIL_ADDRESSE,)
console.log("dotenv mail email: ",process.env.APP_EMAIL_PASSWORD,)

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.APP_EMAIL_ADDRESSE, // à remplacer
    pass: process.env.APP_EMAIL_PASSWORD,
  }
});

module.exports = transporter;
