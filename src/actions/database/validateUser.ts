"use server";
import * as bcrypt from "bcrypt-ts";
import getUser from './getUser';
import { UserCredintialType, EmailType } from "@/types/types";

export default async function validateUser(userCredintial: UserCredintialType) {
    
    const userDoc = await getUser(userCredintial.username);

    if (!userDoc) return null;

    const userData = userDoc.data();
    const passwordMatched = await bcrypt.compare(userCredintial.password, userData.password);

    if (!passwordMatched) return null;

    delete userData.password;

    const primaryEmail = userData.contactInfo.email.find((email: EmailType) => email.type === "primary");
    const primaryEmailAddress = primaryEmail ? primaryEmail.address : null;

    return {
        id: userData.id,
        name: `${userData.personalData.firstName} ${userData.personalData.lastName}`,
        email: primaryEmailAddress,
        image: userData.personalData.image
    };
}





