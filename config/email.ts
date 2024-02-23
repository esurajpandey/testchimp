const nodemailer = require('nodemailer');

export default nodemailer.createTransport({
    host: 'smtp.gmail.com',
    post: 587,
    secure: false,
    requireTLS: true,
    auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_EMAIL_PASSWORD,
    }
})