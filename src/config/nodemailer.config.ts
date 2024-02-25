"use server";
import nodemailer from "nodemailer";
import { MailOptions } from "nodemailer/lib/json-transport";

export default async function sendMail(mailOptions: MailOptions) {
  const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
          user: process.env.NODE_MAILER_ID,
          pass: process.env.NODE_MAILER_PASSWORD
      },
  });

  await new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (err, response) => {
      if (err) {
        reject(err);
      } else {
        resolve(response);
      }
    });
  });
}