"use server";
import { sendTwoStepMail } from "@/lib/nodemailer/twoStepMail";
import { DocumentData } from "firebase-admin/firestore";
import { UserDataType, TwoStepType } from "@/types/types";

interface ExtendedDocumentData extends DocumentData, UserDataType{};


let expireOn: Date, verificationCode: number;

async function request(userData: ExtendedDocumentData) {

    const twoFactorType = userData.loginInfo.twoFactor.type;
    const twoFactorAddress = userData.loginInfo.twoFactor.address;

    const userFullName = `${userData.personalData.firstName} ${userData.personalData.lastName}`;
    
    verificationCode = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;

    if (twoFactorType === "email") await sendTwoStepMail(twoFactorAddress, userFullName, verificationCode);
    else if (twoFactorType === "phoneNumber") {

    } else {
        return {
            status: "error",
            message: `Invalid two step method detected!.`,
        }
    }

    const currentDate = new Date();
    const codeValidity: number = Number(process.env.TWO_FACTOR_VALIDITY) || 30000;
    expireOn = new Date(currentDate.getTime() + codeValidity);

    return {
        status: "two-step",
        message: `Two factor enabled! A code has been sent to ${twoFactorAddress}.`,
        twoStep:  {
            isEnabled: true,
            expireOn
        } as TwoStepType
    }
}

async function verify(code: number) {

    const currentDate = new Date();

    if (currentDate > expireOn || code !== verificationCode) return false;

    return true;
}

export { request, verify };
