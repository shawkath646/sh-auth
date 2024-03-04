"use server";
import { storage } from "@/config/firebase.config";
import { StatusType } from "@/types/types";
import MessagesList from "@/JsonData/MessagesList.json";
import deleteImageByURL from "./deleteImageByURL";

interface StatusExtendedTypes extends StatusType {
    downloadURL: string;
}

export default async function uploadImage(base64: string, name?: string, oldImage?: string): Promise<StatusExtendedTypes> {

    const base64Pattern = /^data:image\/(png|jpeg|jpg|gif);base64,(.+)$/;

    if (base64Pattern.test(base64)) {
        if (oldImage) await deleteImageByURL(oldImage);

        const imageType = base64.split(';')[0].split(':')[1];
        const imageFormat = base64.split(';')[0].split(':')[1].split('/')[1];
        const pureBase64 = base64.replace(/^data:image\/\w+;base64,/, '');

        const buffer = Buffer.from(pureBase64, 'base64');

        const imageSizeInBytes = buffer.length;
        const maxSizeInBytes = 3 * 1024 * 1024;

        if (imageSizeInBytes >= maxSizeInBytes) return {
            status: "error",
            message: MessagesList.M006.message,
            downloadURL: ""
        }

        const file = storage.bucket().file(`${name || "image_undefined"}.${imageFormat}`);

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

        return {
            status: "registred",
            message: "",
            downloadURL: downloadURL[0]
        };
    }
    
    return {
        status: "success",
        message: "",
        downloadURL: base64
    };

}