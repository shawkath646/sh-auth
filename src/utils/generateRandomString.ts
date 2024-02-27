"use server";
import * as crypto from "crypto";

export default async function generateRandomString(length: number, expiresIn?: number) {
    let expireOn = new Date();
    const stringPromise = new Promise<string>((resolve, reject) => {
        crypto.randomBytes(length, (err, buffer) => {
          if (err) {
            reject(err);
          } else {
            const hash = crypto.createHash('sha256');
            hash.update(buffer);
            const hex = hash.digest('hex');
            resolve(hex);
          }
        });
    });

    const string = await stringPromise;

    if (expiresIn) {
        expireOn = new Date(expireOn.getTime() + (expiresIn * 1000));
    }
    return { string, expireOn };
}
