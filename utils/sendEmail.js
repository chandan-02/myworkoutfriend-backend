const SgMail = require("@sendgrid/mail");
const emailApiKey = "";

async function sendEmail(subject, body, to) {
  SgMail.setApiKey(`${process.env.SENDGRID_API}`);
  const msg = {
    to,
    from: {
      name: `${process.env.SENDGRID_PROJECTNAME}`,
      email: `${process.env.SENDGRID_EMAIL}`,
    },
    subject: subject,
    html: `<p>${body}</p>`,
    text: body,
  };
  SgMail.sendMultiple(msg)
    .then((ee) => console.log("Email sent successfully"))
    .catch((err) => console.log(err.message));
}

module.exports = { sendEmail };
