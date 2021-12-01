const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  const tranposter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_ACCOUNT,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: '"Duong vu 👻" harry.vu.24@gmail.com',
    to: options.to,
    subject: "Anh bạn à. Có vẻ như anh bạn bị quên mật khẩu :D",
    html: options.html,
  };

  tranposter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else console.log(info);
  });
};

module.exports = sendEmail
