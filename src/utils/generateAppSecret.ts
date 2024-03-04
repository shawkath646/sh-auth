"use server";
import * as Crypto from "crypto"

export default async function generateAppSecret() {
    const randomBytes = Crypto.randomBytes(32);
    const appSecret = randomBytes.toString('hex');
    return appSecret;
}