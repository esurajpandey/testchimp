const nodemailer = require("nodemailer");
import transporter from "../../config/email";
export default async (email: string, subject: string, msg: string) => {
  const mailOptions = {
    from: process.env.USER_EMAIL,
    to: email,
    subject: subject,
    html: msg,
    dsn: {
      id: "Not sent",
      return: "full",
      notify: ["failure"],
      recipient: process.env.USER_EMAIL,
    },
  };

  return await transporter.sendMail(mailOptions);
};
