"use server";
import { redirect } from "next/navigation";
import * as crypto from "crypto";
import { getToken } from "@/actions/otherActions/tokenManager";
import { auth } from "@/app/auth";
import { db } from "@/config/firebase.config";
import getOAuthData from "@/actions/oAuth/getOAuthInformationCookie";
import getAppData from "@/actions/database/getAppData";
import { CustomSessionType, PrepareOAuthDataType, ProfileType } from "@/types/types";


export default async function prepareOAuthRedirect() {

  const session = await auth() as CustomSessionType;

  const decodedAuthData = await getOAuthData();
  const appData = await getAppData(decodedAuthData.requestedClientId);

  const privateSecretRaw = process.env.OAUTH_PRIVATE_KEY as string;
  const privateSecret = privateSecretRaw.replace(/\\n/g, '\n');
  const authCodeValidity = Number(process.env.AUTHORIZATION_CODE_VALIDITY) || 300;
  const accessTokenValidity = Number(process.env.ACCESS_TOKEN_VALIDITY) || 10080;
  const refreshTokenValidity = Number(process.env.REFRESH_TOKEN_VALIDITY) || 86400;

  const stringPromise = new Promise<string>((resolve, reject) => {
    crypto.randomBytes(32, (err, buffer) => {
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

  const authCodeExpireOn = new Date();
  authCodeExpireOn.setSeconds(authCodeExpireOn.getSeconds() + authCodeValidity);

  const profile: ProfileType = {
    id: session.user.id,
    sub: session.user.id,
    email: session.user.email,
    email_verified: session.user.emailVerified,
    picture: session.user.image,
    given_name: session.user.firstName,
    family_name: session.user.lastName,
    name: session.user.username,
    aud: appData.id,
    iss: `${process.env.APP_BASE_URL}/api/oauth`,
    nonce: decodedAuthData.requestedNonce,
  };
  
  if (decodedAuthData.requestedScope.includes("advanced")) {
    profile.gender = session.user.gender;
    profile.dateOfBirth = session.user.dateOfBirth;
    profile.country = session.user.country;
    profile.phoneNumber = session.user.phoneNumber;
    profile.isEnterpriseUser = session.user.isEnterpriseUser;
  }

  
  const { token: accessToken, expireOn: accessTokenExpireOn } = await getToken({ expiresIn: accessTokenValidity });
  const { token: refreshToken, expireOn: refreshTokenExpireOn } = await getToken({ expiresIn: refreshTokenValidity });
  const { token: idToken, expireOn: idTokenExpireOn } = await getToken({ payload: profile, secret: privateSecret, expiresIn: 300, algorithm: "RS256" });
  const authCode = await stringPromise;

  const dataSet = {
    authCode: {
      code: authCode,
      expireOn: authCodeExpireOn
    },
    accessToken: {
      token: accessToken,
      expireOn: accessTokenExpireOn,
    },
    refreshToken: {
      token: refreshToken,
      expireOn: refreshTokenExpireOn
    },
    idToken: {
      token: idToken,
      expireOn: idTokenExpireOn
    },
    appId: decodedAuthData.requestedClientId,
    userId: session.user.id,
    requestData: decodedAuthData
  } as PrepareOAuthDataType;

  await db.collection("OAuthRequests").doc(decodedAuthData.requestedClientId + session.user.id).set(dataSet);
  return redirect(`${decodedAuthData.requestedRedirectUri}?code=${authCode}&state=${decodedAuthData.requestedState}`);
}