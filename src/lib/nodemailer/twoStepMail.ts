import { ApplicationBasicDataType } from "@/types/types";
import getApplicationBasicData from "../getApplicationBasicData";
import sendMail from "./sendMail";


export async function sendTwoStepMail(destination: string, fullName: string, verificationCode: number) {

    const { stockAppData, brandData } = JSON.parse(await getApplicationBasicData()) as ApplicationBasicDataType;

    const mailVerificationMailLayout = {
        subject: "Two step verification code - CloudBurst Lab Account",
        html: `
            <!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width,initial-scale=1.0">
                    <link rel="preconnect" href="https://fonts.googleapis.com">
                    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                    <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">
                    <title>Verify Your Email Address - CloudBurst Lab Account Activation</title>

                    <style>
                        *{
                            margin: 0;
                            padding: 0;
                            font-family: "Poppins", sans-serif;
                        }
                        body {
                            padding: 5px;
                        }
                        .container {
                            max-width: 600px;
                            margin: 0 auto;
                        }
                        header {
                            padding: 20px;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            background: #ece9e9;
                        }
                        .header-logo {
                            width: 30px;
                            height: 30px;
                        }
                        .header-title {
                            font-size: 20px;
                            font-weight: 500;
                            margin-left: 20px;
                        }
                        .mail-body {
                            padding: 10px;
                            background: white;
                        }
                        .body-title {
                            margin-top: 20px;
                            text-align: center;
                            font-size: 30px;
                            font-weight: 600;
                        }
                        .body-text {
                            color: #2c2c2c;
                            font-size: 15px;
                            margin: 10px 0;
                        }
                        .code-title {
                            text-align: center;
                            font-size: 22px;
                            font-weight: 600;
                        }
                        .verification-code {
                            width: 200px;
                            margin: 10px auto;
                            color: white;
                            background: rgb(0, 110, 255);
                            border-radius: 10px;
                            padding: 8px;
                            font-size: 24px;
                            font-weight: 500;
                            letter-spacing: 10px;
                            text-align: center;
                        }
                        footer {
                            margin-top: 22px;
                        }
                        .parent-branding {
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            text-decoration: none;
                        }
                        .parent-logo {
                            height: 80px;
                            width: 80px;
                        }
                        .parent-text {
                            color: #00a2ff;
                            font-weight: 500;
                            margin: auto 10px;
                        }
                        .brandng-section {
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            font-size: 18px;
                        }
                        .branding-text {
                            margin-left: auto;
                            width: 350px;
                            color: #2c2c2c;
                            font-size: 13px;
                        }
                        .footer-text {
                            margin-top: 35px;
                            text-align: center;
                            color: #494848;
                        }
                    </style>
                </head>

                <body>
                    <main class="container">
                        <header>
                            <img src="${stockAppData.appIcon}" alt="${stockAppData.appName} icon" class="header-logo" />
                            <p class="header-title">${stockAppData.appName}</p>
                        </header>
                        <section class="mail-body">
                            <p class="body-title">Two step verification mail</p>
                            <p class="body-text">Dear ${fullName},</p>
                            <p class="body-text">You’ve received this message because someone is attempting to sign in your CloudBurst Lab account. If this sign in request was initiated by you, please use the provided verification code to complete the process.</p>
                            <p class="code-title">Verification code</p>
                            <p class="verification-code">${verificationCode}</p>
                            <p class="body-text">If you did not initiate this request, please click the restrict button below to prevent unauthorized access.</p>
                            <p class="body-text">Please refrain from replying to this email as it is automatically generated by the CloudBurst Lab server. If you have any questions or need assistance, kindly reach out to our <a href="${brandData.help}">help center</a> for support.</p>
                        </section>

                        <footer>
                            <section class="brandng-section">
                                <a href="${brandData.website}" class="parent-branding">
                                    <img src="${brandData.icon}" alt="${brandData.name} icon" class="parent-logo" />
                                    <p class="parent-text">${brandData.name}</p>
                                </a>
                                <p class="branding-text">An innovative solution developed under the auspices of our parent company, CloudBurst Lab, brings cutting-edge technology directly to your fingertips.</p>
                            </section>
                            <p class="footer-text">${brandData.copyrightText}</p>
                        </footer>
                    </main>
                </body>
            </html>
        `
    }

    const mailOptions = {
        from: process.env.NODEMAILER_EMAIL,
        to: destination,
        subject: mailVerificationMailLayout.subject,
        html: mailVerificationMailLayout.html,
    };

    await sendMail(mailOptions);
}
