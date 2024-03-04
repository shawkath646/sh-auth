"use server";
import { headers } from "next/headers";
import * as bcrypt from "bcrypt-ts";
import getUserByEmail from "./getUser";
import { db } from "@/config/firebase.config";
import uploadImage from "./uploadImage";
import userObject from "@/Schema/userObject";
import { RegistrationBoxInputType, StatusType } from "@/types/types";
import MessagesList from "@/JsonData/MessagesList.json";


export default async function newUserRegistration(userData: RegistrationBoxInputType): Promise<StatusType> {

    const existingUser = await getUserByEmail(userData.email);

    if (existingUser) return {
        status: "error",
        message: MessagesList.M003.message
    }

    const cleanedLocalPart = userData.email.split('@')[0].replace(/\./g, '');
    const cleanedEmail = `${cleanedLocalPart}@${userData.email.split('@')[1]}`;

    const userDocRef = db.collection('userData').doc();

    if (userData.image) {
        const uploadImageResponse = await uploadImage(userData.image, `user_profile_${userDocRef.id}`);
        if (uploadImageResponse.status === "error") return uploadImageResponse;
        userObject.personalData.image = uploadImageResponse.downloadURL;
    }

    
    const headersList = headers();
    const clientIp = headersList.get("x-forwarded-for") || 'Not available';
    const userAgent = headersList.get("user-agent") || 'Not available';
    const response = await fetch(`http://ip-api.com/json/${clientIp}`);
    const clientLocation = await response.json();

    const saltRounds = Number(process.env.BCRYPT_SALT_ROUND) || 10;
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

    userObject.id = userDocRef.id;
    userObject.personalData.firstName = userData.firstName;
    userObject.personalData.lastName = userData.lastName;
    userObject.personalData.address.permanent.country = userData.country;
    userObject.personalData.dateOfBirth = userData.dateOfBirth;
    userObject.personalData.gender = userData.gender;
    userObject.contactInfo.email[0].address = cleanedEmail;
    userObject.contactInfo.phoneNumber[0].countryCode = userData.countryCode;
    userObject.contactInfo.phoneNumber[0].number = userData.phoneNumber;
    userObject.username = cleanedLocalPart;
    userObject.loginInfo.createdBy.clientIp = clientIp;
    userObject.loginInfo.createdBy.clientLocation = clientLocation;
    userObject.loginInfo.createdBy.userAgent = userAgent;
    userObject.password = hashedPassword;
    
    await userDocRef.set(userObject);

    return {
        status: "registred",
        message: MessagesList.M004.message
    };
}