require('dotenv').config();
const { MailerSend, EmailParams, Sender, Recipient } = require("mailersend");

async function enviarEmail(nome, link, email) {
    try {
        const mailersend = new MailerSend({
            apiKey: process.env.MAILER_KEY
        });

        const sentFrom = new Sender("test@trial-z3m5jgrww50ldpyo.mlsender.net", "Capy Study");

        const recipients = [new Recipient(email, nome)];

        const personalization = [
            {
                email: email,
                data: {
                    link: link,
                    name: nome,
                    account_name: 'Capy Study',
                    support_email: 'support@trial-z3m5jgrww50ldpyo.mlsender.net'
                },
            }
        ];

        const emailParams = new EmailParams()
            .setFrom(sentFrom)
            .setTo(recipients)
            .setSubject("Alteração de senha")
            .setTemplateId(process.env.TEMPLATE_ID)
            .setPersonalization(personalization);

        await mailersend.email.send(emailParams)
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
            });

        console.log("Email enviado");
    } catch (err) {
        console.log(err);
    }
}

module.exports = enviarEmail;
