import nodemailer from "nodemailer";
import "dotenv/config";

const sendEmail = async ({email, html, subject}) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_APP_NAME,
            pass: process.env.EMAIL_APP_PASSWORD,
        },
    });

    (async () => {
        const info = await transporter.sendMail({
            from: '"T3 SAHUR" <no-reply@t3shaurshop.com>',
            to: email,
            subject: subject,
            html: html,
        });
    })();
};

export default {sendEmail};
