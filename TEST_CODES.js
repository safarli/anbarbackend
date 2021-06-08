
const strobj = "Bendali";
const serializedstr = JSON.stringify(strobj);
const deserializedstr = JSON.parse(serializedstr);
console.log(strobj === deserializedstr);


const nodemailer = require('nodemailer')

async function main() {
    let testAccount = await nodemailer.createTestAccount();
    let transporter = nodemailer.createTransport({
        host: "www.texnokom.az",
        port: 465,
        secure: true,
        auth: {
            user: "admin@texnokom.az",
            pass: "@texno999@"
        }
    })

    let info = await transporter.sendMail({
        from: '"Safari Safarli 👻" <admin@texnokom.az>', // sender address
        to: "test-1ukkkghdl@srv1.mail-tester.com, wilecto@gmail.com", // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        html: "<b>Hello world?</b>", // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

main().catch(e => console.log(e))