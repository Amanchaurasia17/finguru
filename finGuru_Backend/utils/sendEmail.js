const nodemailer = require('nodemailer');

const sendTaxEmail = async (email, taxData) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    secure: process.env.SMTP_SECURE === 'true' || true,
    auth: {
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS, 
    },
  });

  const mailOptions = {
    from: `"Finguru TaxBot" <${process.env.EMAIL_USER}>`, 
    to: email,
    subject: 'Your Tax Optimization Summary',
    html: `
      <h3>Finguru Tax Report</h3>
      <p><strong>Total Income:</strong> ₹${taxData.annualIncome}</p>
      <p><strong>Deductions:</strong> <pre>${JSON.stringify(taxData.deductions, null, 2)}</pre></p>
      <p><strong>Old Regime Tax:</strong> ₹${taxData.oldRegimeTax}</p>
      <p><strong>New Regime Tax:</strong> ₹${taxData.newRegimeTax}</p>
      <p><strong>Recommended Regime:</strong> ${taxData.recommended}</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendTaxEmail;
