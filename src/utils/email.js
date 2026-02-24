const nodemailer = require("nodemailer");

async function sendSignupEmail(userEmail){
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "mughalsameer007@gmail.com",
      pass: "pkxy gbbj cabo eohm"
    }
  });

  const htmlTemplate = `
    <div style="font-family: Arial, sans-serif; padding:20px; max-width:600px; margin:auto; border:1px solid #eee; border-radius:10px;">
      <h2 style="color:#333; text-align:center;">🎉 Signup Successful</h2>
      <p>Welcome! Your account has been created successfully on <b>Sameer Shoe Buyer</b>.</p>
      <p>You can now login and start exploring our platform.</p>
      
      <div style="text-align:center; margin-top:25px;">
        <a href="#" style="background:#000; color:#fff; padding:12px 25px; text-decoration:none; border-radius:6px;">
          Go to Website
        </a>
      </div>

      <p style="margin-top:30px; font-size:12px; color:#777;">
        If you didn’t signup, please ignore this email.
      </p>
    </div>
  `;

  await transporter.sendMail({
    from: "mughalsameer007@gmail.com",
    to: userEmail,
    subject: "Signup Successful on Sameer Shoe Buyer",
    html: htmlTemplate
  });
}

//maybe i use it in future
async function sendResetPasswordEmail(userEmail){}

module.exports = {
  sendSignupEmail,
  sendResetPasswordEmail
};