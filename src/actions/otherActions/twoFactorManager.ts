"use server";
import { sendTwoStepMail } from "@/actions/otherActions/twoStepMail";
import { DocumentData } from "firebase-admin/firestore";
import { UserDataType, TwoStepType, StatusType } from "@/types/types";

interface ExtendedDocumentData extends DocumentData, UserDataType { };
interface ExtendedStatusType extends StatusType {
    twoStep: TwoStepType
}

let expireOn: Date, verificationCode: number;

async function request(userData: ExtendedDocumentData): Promise<StatusType | ExtendedStatusType> {
    const currentDate = new Date();

    if (expireOn > currentDate) {
        return {
            status: "error",
            message: "Please initiate a new verification code request after a set period of time."
        };
    }

    const twoFactorType = userData.loginInfo.twoFactor.type;
    const twoFactorAddress = userData.loginInfo.twoFactor.address;
    const userFullName = `${userData.personalData.firstName} ${userData.personalData.lastName}`;
    verificationCode = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;

    if (twoFactorType === "email") {
        await sendTwoStepMail(twoFactorAddress, userFullName, verificationCode);
    } else if (twoFactorType === "phoneNumber") {
        // Code to send SMS
    } else {
        return {
            status: "error",
            message: "Invalid two-step method detected."
        };
    }

    const codeValidity: number = Number(process.env.TWO_FACTOR_VALIDITY) || 30000;
    expireOn = new Date(currentDate.getTime() + codeValidity);

    return {
        status: "two-step",
        message: `Two-factor authentication enabled! A code has been sent to ${twoFactorAddress}.`,
        twoStep: {
            isEnabled: true,
            expireOn
        }
    };
}


async function verify(code: number): Promise<StatusType> {
    const currentDate = new Date();
    if (currentDate > expireOn || code !== verificationCode) {
        return {
            status: "error",
            message: "Invalid or expired verification code detected!.",
        };
    } else {
        return {
            status: "success",
            message: "Two-factor code verified successfully.",
        };
    }
}

export { request, verify };
