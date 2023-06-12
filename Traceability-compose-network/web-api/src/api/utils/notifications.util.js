import nodemailer from "nodemailer";
import dotenv from 'dotenv';
dotenv.config();

const smtp_username = process.env.SMTPUSERNAME;
const smtp_password = process.env.SMTPPASSWORD;
// const smtp_username = 'houstondirectautolead@gmail.com';
// const smtp_password = 'Hd#AmL@0258.1086';

const transporter = nodemailer.createTransport({
    service: "Gmail",  // sets automatically host, port and connection security settings
    auth: {
        user: smtp_username,
        pass: smtp_password
    }
});


const sendEmailByNodemailer = async (to, subject, message) => {
    // setup email data with unicode symbols
    const mailOptions = {
        from: '"Infobeans Admin" <' + smtp_username + '>', // sender address
        to: to, // list of receivers
        subject: subject, // Subject line
        html: message
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        } else {
            console.log('Message sent: %s', info.messageId);
        }
    });

    transporter.close();
}

export default { sendEmailByNodemailer }