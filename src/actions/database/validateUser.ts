import { cache } from "react";
import * as bcrypt from "bcrypt-ts";
import getUser from './getUser';
import { UserCredintialType, EmailType } from "@/types/types";


const validateUser = cache(async(userCredintial: UserCredintialType) => {
    const userData = await getUser(userCredintial.username);

    if (!userData) return null;

    const passwordMatched = await bcrypt.compare(userCredintial.password, userData.password as string);

    if (!passwordMatched) return null;

    const primaryEmail = userData.contactInfo.email.find((email: EmailType) => email.type === "primary");
    const primaryEmailAddress = primaryEmail ? primaryEmail.address : null;

    return {
        id: userData.id,
        name: `${userData.personalData.firstName} ${userData.personalData.lastName}`,
        email: primaryEmailAddress,
        image: userData.personalData.image
    };
})

export default validateUser;
