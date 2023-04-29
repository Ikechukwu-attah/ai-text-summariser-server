import nodemailer from "nodemailer";
import QRCode from "qrcode";
import * as dotenv from "dotenv";

dotenv.config();
export const sendOTPEmail = async (email, otpToken, secretKey) => {
  try {
    const otpUrl = await QRCode.toDataURL(secretKey.otpauth_url);

    const transporter = nodemailer.createTransport({
      // host: process.env.EMAIL_HOST,
      // port: process.env.EMAIL_PORT,
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
      },
    });

    const mailOptions = {
      from: process.env.MAILTRAP_USER,
      to: email,
      subject: "Your OTP Token and Secret Key",
      text: `Your OTP token is: ${otpToken}\nScan the QR code below in Google Authenticator app to add the account:\n${otpUrl}`,
      html: `<p>Your OTP token is: ${otpToken}</p><p>Scan the QR code below in Google Authenticator app to add the account:</p><p><img src="${otpUrl}" alt="QR Code" /></p>`,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log("Error sending OTP email:", error);
  }
};
