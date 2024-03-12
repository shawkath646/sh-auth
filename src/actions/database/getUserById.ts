import { cache } from "react";
import { db } from "@/config/firebase.config";
import { UserDataType } from "@/types/types";

const getUserById = cache(async(userId: string) => {
    const docRef = await db.collection("userData").doc(userId).get();
    if (!docRef.exists) return null;
    return docRef.data() as UserDataType;
})

export default getUserById;