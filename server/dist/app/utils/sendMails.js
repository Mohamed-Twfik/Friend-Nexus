"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const nodemailer_1 = __importDefault(require("nodemailer"));
dotenv_1.default.config();
const sendEmail = (to, subject, message, link = { url: "", description: "" }) => __awaiter(void 0, void 0, void 0, function* () {
    const transport = nodemailer_1.default.createTransport({
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
    `;
    const mailOptions = {
        from: process.env.MAIL_USER,
        to: to,
        subject: subject,
        html
    };
    transport.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.error('Email sending failed:', err);
        }
        else {
            console.log('Email sent: ' + info.response);
        }
    });
});
exports.default = sendEmail;
