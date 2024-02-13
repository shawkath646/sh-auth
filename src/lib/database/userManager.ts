"use server";
import { headers } from 'next/headers'
import { auth } from '@/app/auth';
import * as bcrypt from "bcrypt-ts";
import { QueryDocumentSnapshot } from "firebase-admin/firestore";
import { db, fieldValue, storage } from "./firebase";
import GettedUserData, { UserCredintialType, Email, RegistrationBoxInputType } from "@/types/gettedUserDataType";
import MessagesList from "@/lib/MessagesList.json";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const usernameRegex = /^[a-zA-Z0-9]+$/;

export async function getUserByEmail(userEmail: string) {
    let filteredUser: QueryDocumentSnapshot[] = [], usernameType;

    if (emailRegex.test(userEmail)) usernameType = "email";
    else if (usernameRegex.test(userEmail)) usernameType = "username";
    else return;

    if (usernameType === "username") {
        const userQuerySnapshot = await db.collection('userData').where('username', '==', userEmail).get();
        filteredUser = userQuerySnapshot.docs;
    } else if (usernameType === "email") {
        const cleanedLocalPart = userEmail.split('@')[0].replace(/\./g, '');
        const cleanedEmail = `${cleanedLocalPart}@${userEmail.split('@')[1]}`;

        const userQuerySnapshot = await db.collection('userData').get();
        filteredUser = userQuerySnapshot.docs.filter((doc: QueryDocumentSnapshot) => {
            const emailArray = doc.data().contactInfo.email;
            return emailArray.some((entry: Email) => entry.address === cleanedEmail);
        });
    }

    if (filteredUser.length === 0) return;

    return filteredUser[0];
}


export async function validateUser(userCredintial: UserCredintialType) {
    
    const userDoc = await getUserByEmail(userCredintial.username);

    if (!userDoc) throw new Error(JSON.stringify({
        status: {
            code: MessagesList.M020.code,
            message: MessagesList.M020.message,
        },
        user: null
    }));

    const userData = userDoc.data();
    const passwordMatched = await bcrypt.compare(userCredintial.password, userData.password);

    if (!passwordMatched) throw new Error(JSON.stringify({
        status: {
            code: MessagesList.M021.code,
            message: MessagesList.M021.message,
        },
        user: null
    }));

    delete userData.password;

    if (userData.loginInfo.isSuspended) throw new Error(JSON.stringify({
        status: {
            code: MessagesList.M022.code,
            message: MessagesList.M022.message,
        },
        user: null
    }));

    const primaryEmail = userData.contactInfo.email.find((email: Email) => email.type === "primary");
    const primaryEmailAddress = primaryEmail ? primaryEmail.address : null;

    return {
        status: {
            code: MessagesList.M001.code,
            message: MessagesList.M001.message,
        },
        user: {
            id: userData.id,
            name: `${userData.personalData.firstName} ${userData.personalData.lastName}`,
            email: primaryEmailAddress,
            image: userData.personalData.image
        }
    };
}

export async function getUserData(userEmail: string) {
    const userDoc = await getUserByEmail(userEmail);

    if (!userDoc) return;

    return userDoc.data();
}

export async function saveLoginHistory(userId: string) {

    const userDoc = await db.collection("userData").doc(userId).get();

    if (!userDoc.exists) return;

    const headersList = headers();

    const clientIp = headersList.get("x-forwarded-for") || 'Not available';
    const userAgent = headersList.get("user-agent") || 'Not available';

    const response = await fetch(`http://ip-api.com/json/${clientIp}`);
    const clientLocation = await response.json();

    const loginHistory = userDoc.data()?.loginInfo.loginHistory || [];
    const existingIndex = loginHistory.findIndex((history: any) => history.clientIp === clientIp);

    if (existingIndex !== -1) {
        const updatedLoginHistory = [...loginHistory];
        updatedLoginHistory[existingIndex] = { clientIp, userAgent, clientLocation, timestamp: new Date() };

        await userDoc.ref.update({ "loginInfo.loginHistory": updatedLoginHistory });
    } else {
        await userDoc.ref.update({
            "loginInfo.loginHistory": fieldValue.arrayUnion({
                clientIp,
                userAgent,
                clientLocation,
                timestamp: new Date()
            })
        });
    }
}

export async function userRegistration(userData: RegistrationBoxInputType) {

    const existingUser = await getUserByEmail(userData.email);

    if (existingUser) return {
        success: false,
        code: MessagesList.M003.code,
        message: MessagesList.M003.message
    }

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
            success: false,
            code: MessagesList.M006.code,
            message: MessagesList.M006.message
        };
    
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

    const userObject: GettedUserData = {
        id: userDocRef.id,
        personalData: {
            firstName: userData.firstName,
            lastName: userData.lastName,
            address: {
                present: {
                    street: "",
                    postalCode: 0,
                    city: "",
                    state: "",
                    country: userData.country
                },
                permanent: {
                    street: "",
                    postalCode: 0,
                    city: "",
                    state: "",
                    country: ""
                },
            },
            dateOfBirth: userData.dateOfBirth,
            gender: userData.gender,
            image: imageDownloadURL || session?.user.image || '',
        },
        contactInfo: {
            email: [
                {
                    type: "primary",
                    address: session?.user.email || cleanedEmail,
                    verified: false
                }
            ],
            phoneNumber: [
                {
                    countryCode: userData.countryCode,
                    number: userData.phoneNumber,
                    verified: false
                }
            ]
        },
        permissions: [],
        username: cleanedLocalPart,
        loginInfo: {
            createdBy: {
                userAgent: userAgent,
                clientIp: clientIp,
                clientLocation: clientLocation,
                timestamp: new Date(),
            },
            isSuspended: false,
            loginHistory: []
        },
        password: hashedPassword
    };
    
    await userDocRef.set(userObject);

    return {
        success: true,
        code: MessagesList.M004.code,
        message: MessagesList.M004.message
    };
}
