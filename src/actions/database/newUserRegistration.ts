"use server";
import { headers } from "next/headers";
import { auth } from '@/app/auth';
import * as bcrypt from "bcrypt-ts";
import getUserByEmail from "./getUser";
import { db, storage } from "@/config/firebase.config";
import userObject from "@/Schema/userObject";
import { RegistrationBoxInputType, StatusType } from "@/types/types";
import MessagesList from "@/JsonData/MessagesList.json";


export default async function newUserRegistration(userData: RegistrationBoxInputType) {

    const existingUser = await getUserByEmail(userData.email);

    if (existingUser) return {
        status: "error",
        message: MessagesList.M003.message
    } as StatusType;

    const cleanedLocalPart = userData.email.split('@')[0].replace(/\./g, '');
    const cleanedEmail = `${cleanedLocalPart}@${userData.email.split('@')[1]}`;

    const session = await auth();

    const userDocRef = db.collection('userData').doc();

    let imageDownloadURL;

    const base64Pattern = /^data:image\/(png|jpeg|jpg|gif);base64,(.+)$/;

    if (userData.image && base64Pattern.test(userData.image)) {

        const imageType = userData.image.split(';')[0].split(':')[1];
        const imageFormat = userData.image.split(';')[0].split(':')[1].split('/')[1];

        const pureBase64 = userData.image.replace(/^data:image\/\w+;base64,/, '');

        const buffer = Buffer.from(pureBase64, 'base64');

        const imageSizeInBytes = buffer.length;
        const maxSizeInBytes = 3 * 1024 * 1024;

        if (imageSizeInBytes >= maxSizeInBytes) return {
            status: "error",
            message: MessagesList.M006.message
        } as StatusType;
    
        const file = storage.bucket().file(`profile_${cleanedLocalPart}.${imageFormat}`);

        const expirationDate = new Date();
        expirationDate.setFullYear(expirationDate.getFullYear() + 100);

        await file.save(buffer, {
            contentType: imageType,
            public: true
        });

        const downloadURL = await file.getSignedUrl({
            action: 'read',
            expires: expirationDate,
        });

        imageDownloadURL = downloadURL[0];

    } else {
        imageDownloadURL = userData.image || '';
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
    userObject.personalData.image =  imageDownloadURL || session?.user.image || '';
    userObject.contactInfo.email[0].address = session?.user.email || cleanedEmail;
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
    } as StatusType;
}