// services/emailService.js
const transporter = require('../utils/mailer');

async function sendStatusChangeEmail(toEmail, candidateName, jobTitle, newStatus) {
  const mailOptions = {
    from: `"HireMe" ${process.env.APP_EMAIL_ADDRESSE}` ,
    to: toEmail,
    subject: 'Mise à jour de votre candidature',
    html: `
      <p>Bonjour ${candidateName},</p>
      <p>Le statut de votre candidature pour le poste <strong>${jobTitle}</strong> a été mis à jour :</p>
      <p><strong>Nouveau statut :</strong> ${newStatus}</p>
      <p>Merci pour votre intérêt pour notre entreprise.</p>
      <p>L’équipe HireMe</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email envoyé à', toEmail);
  } catch (error) {
    console.error('Erreur lors de l’envoi de l’email :', error);
  }
}

module.exports = { sendStatusChangeEmail };
