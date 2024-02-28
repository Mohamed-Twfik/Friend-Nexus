import dotenv from "dotenv";
import nodemailer from "nodemailer";
dotenv.config();

const sendEmail = async (to: string, subject: string, message: string, link = {url:"",description:""}) => {
  const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  });
  const html = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Farm Vision Email</title>
          <style>
            body{
              text-align: center;
              color: #333;
              padding: 3% 30%;
              font-size: large;
            }
            #link{
              background-color: #333;
              color: #ddd;
              padding: 10px;
              text-decoration: none;
            }
          </style>
        </head>
        <body>
          <h1>${subject}</h1>
          <p>${message}</p>
          <a id="link" href="${link.url}">${link.description}</a>
          <p> Have any questions so far? Visit <a href="#">Sociopedia Support</a> or <a href="#">Contact Us</a>.</p>
          <p>Thanks,</p>
          <p>Sociopedia</p>
        </body>
      </html>
    `
  const mailOptions = {
    from: process.env.MAIL_USER,
    to: to,
    subject: subject,
    html
  }
  transport.sendMail(mailOptions, (err: Error | null, info: any) => {
    if (err) {
      console.error('Email sending failed:', err);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

export default sendEmail;