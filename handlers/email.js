const nodeMailer = require('nodemailer');
const pug = require('pug');
const juice = require('juice');
const htmlToText = require('html-to-text');
const util = require('util');
const emailConfig = require('../config/email');

let transport = nodeMailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    auth: {
      user: emailConfig.user,
      pass: emailConfig.pass,
    },    
});

const generarHTML = (archivo, opciones = {}) => {
    const html = pug.renderFile(`${__dirname}/../views/emails/${archivo}.pug`, opciones);
    return juice(html);
}

exports.enviar = async (opciones) => {
    const html = generarHTML(opciones.archivo, opciones);
    const text = htmlToText.htmlToText(html);

    let opcionesEmail = {
        from: 'Uptask <no-reply@uptask.com>',
        to: opciones.usuario.email, // realmente esto no es relevante
        subject: opciones.subject,
        text,
        html
    };

    const enviarEmail = util.promisify(transport.sendMail, transport);
    return enviarEmail.call(transport, opcionesEmail);
    (mailOptions);
}
