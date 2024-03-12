import { InputHTMLAttributes } from "react";
import { JwtPayload } from "jsonwebtoken";
import { FieldError } from "react-hook-form";
import { Timestamp } from "@/config/firebase.config";

export interface TimestampFieldValue {
  _seconds: number;
  _nanoseconds: number;
}

export interface PhoneNumberType {
  number: string;
  countryCode: string;
  verified: boolean;
}

export interface EmailType {
  address: string;
  type: string;
  verified: boolean;
}

export interface AddressType {
  country: string;
  city: string;
  street: string;
  postalCode: number;
  state: string;
}

export interface PersonalDataType {
  firstName: string;
  lastName: string;
  dateOfBirth: Timestamp | Date | TimestampFieldValue;
  gender: string;
  image: string;
  address: {
    permanent: AddressType;
    present: AddressType;
  };
}

export interface PermissionType {
  roles: string[];
  appId: string;
}

export interface ContactInfoType {
  phoneNumber: PhoneNumberType[];
  email: EmailType[];
}

export interface LoginHistoryType {
  userAgent: string;
  clientIp: string;
  clientLocation: any;
  timestamp?: Timestamp | Date | TimestampFieldValue;
  refreshToken?: {
    token: string;
    expireOn: Date;
  };
}

export interface LoginInfoType {
  createdBy: LoginHistoryType;
  twoFactor: {
    isEnabled: boolean;
    type: string;
    address: string;
  };
  isSuspended: boolean;
  loginHistory: LoginHistoryType[];
}

export interface UserDataType {
  id: string;
  username: string;
  permissions: PermissionType[];
  contactInfo: ContactInfoType;
  personalData: PersonalDataType;
  loginInfo: LoginInfoType;
  password?: string;
  isEnterpriseUser: boolean;
  oldUser?: boolean;
}

export interface UserCredintialType {
  username: string;
  password: string;
}

export interface CustomSessionType {
  user: {
    name: string | null;
    email: string | null;
    emailVerified: boolean;
    image: string | null;
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    gender: "male" | "female" | "others";
    dateOfBirth: Timestamp | Date | TimestampFieldValue;
    country: string;
    isEnterpriseUser: boolean;
  }
  expires: string
}

export interface RegistrationBoxInputType {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  countryCode: string;
  phoneNumber: string;
  dateOfBirth: Date;
  gender: string;
  country: string;
  image?: string;
}

export interface StatusType {
  status: "error" | "authenticated" | "two-step" | "initial" | "registred" | "success";
  message: string;
}

export interface CookieJsonType extends JwtPayload {
  requestedClientId: string;
  requestedRedirectUri: string;
  requestedCodeChallenge: string;
  requestedCodeChallengeMethod: string;
  requestedScope: string;
  requestedResponseType: string;
  requestedState: string;
  requestedNonce: string;
}

export interface ProfileType {
  name?: string | null;
  email?: string | null;
  email_verified: boolean;
  picture?: string | null;
  id?: string;
  sub?: string;
  given_name: string;
  family_name: string;
  aud: string;
  iss: string;
  nonce?: string;
  gender?: string;
  dateOfBirth?: Date | TimestampFieldValue | Timestamp;
  country?: string;
  phoneNumber?: string;
  permissions?: PermissionType[];
  isEnterpriseUser?: boolean;
};

export interface AppDataType {
  appIcon: string;
  appName: string;
  appSecret: string;
  author: string;
  createdOn: Timestamp | Date | TimestampFieldValue;
  id: string;
  version: string;
  website: string;
  privacyPolicy: string;
  contact: string;
  redirectUrl: string[];
  inactiveMessage: string;
  status: "active" | "suspended" | "inactive" | "";
  inactiveUntil: Date | null;
  pageAlertMessage: string;
  pageAlertAction: string;
  scope: string[];
  description: string;
  appType: "web application"
  | "android application"
  | "ios application"
  | "native application"
  | "";

}

export interface PartialAppDataType {
  appIcon?: string;
  appName: string;
  version: string;
  website: string;
  privacyPolicy?: string;
  contact: string;
  redirectUrl: string[];
  inactiveMessage?: string;
  status: string;
  inactiveUntil?: Date | null;
  pageAlertMessage?: string;
  pageAlertAction?: string;
  description?: string;
  appType: string;
}

export interface BrandDataType {
  category: string;
  name: string;
  icon: string;
  email: string;
  type: string;
  help: string;
  copyrightText: string;
  privacyPolicy: string;
  socialPlatform: SocialPlatformInfo[];
  website: string;
}

export interface SocialPlatformInfo {
  icon: string;
  name: string;
  url: string;
}


export interface InputBoxType extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: FieldError;
  className?: string;
}

export interface VerificationCodeBoxType extends InputHTMLAttributes<HTMLInputElement> {
  isTwoStep: boolean;
  className?: string;
}

export interface TwoStepType {
  isEnabled: boolean;
  expireOn: Date;
}


export interface PrepareOAuthDataType {
  authCode: {
    code: string;
    expireOn: Timestamp | Date | TimestampFieldValue;
  },
  accessToken: {
    token: string;
    expireOn: Timestamp | Date | TimestampFieldValue;
  },
  refreshToken: {
    token: string;
    expireOn: Timestamp | Date | TimestampFieldValue;
  },
  idToken: {
    token: string;
    expireOn: Timestamp | Date | TimestampFieldValue;
  };
  userId: string;
  appId: string;
  requestData: CookieJsonType;
}
