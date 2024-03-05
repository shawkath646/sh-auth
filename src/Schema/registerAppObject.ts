import { Timestamp, fieldValue } from "@/config/firebase.config";
import { AppDataType } from "@/types/types";



const registerAppObject: AppDataType = {
    appName: "",
    appIcon: "",
    appType: "web application",
    status: "active",
    appSecret: "",
    author: "",
    contact: "",
    inactiveMessage: "",
    callbackUrl: [],
    createdOn: fieldValue.serverTimestamp() as Timestamp,
    id: "",
    privacyPolicy: "",
    scope: ["openid", "email", "profile"],
    version: "",
    website: "",
    description: "",
}

export default registerAppObject;