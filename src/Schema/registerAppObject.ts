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
    redirectUrl: [],
    createdOn: fieldValue.serverTimestamp() as Timestamp,
    id: "",
    privacyPolicy: "",
    scope: ["openid", "email", "profile"],
    version: "",
    website: "",
    description: "",
    inactiveUntil: null,
    pageAlertAction: "",
    pageAlertMessage: "",
}

export default registerAppObject;