import { InputHTMLAttributes } from "react";
import { JWTPayload } from "jose";
import { FieldError } from "react-hook-form";
import { FieldValue } from "firebase-admin/firestore";

export interface DateOfBirthType {
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
  dateOfBirth: DateOfBirthType | Date | FieldValue;
  gender: string;
  image: string;
  address: {
    permanent: AddressType;
    present: AddressType;
  };
}
  
  export interface PermissionType {
    role: string;
    app_id: string;
  }
  
  export interface ContactInfoType {
    phoneNumber: PhoneNumberType[];
    email: EmailType[];
  }

  export interface LoginHistoryType {
    userAgent: string;
    clientIp: string;
    clientLocation: any;
    timestamp?: DateOfBirthType | Date | FieldValue;
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
    user?: {
      name?: string | null
      email?: string | null
      image?: string | null
      id?: string;
      username?: string;
      permissions?: PermissionType[];
      oldUser? :boolean;
      country: string;
      isEnterpriseUser: string
    }
    expires: string
  }
  

  export interface PayloadType {
    app_id: string;
    app_secret?: string;
    refresh_token?: string;
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

  export interface BoxPropsType {
    stockAppData?: {
      name: string;
      icon: string;
    },
    requestedAppData?: {
      name: string;
      icon: string;
    }
  }

  export interface StatusType {
    status: "error" | "authenticated" | "two-step" | "initial" | "registred";
    message: string;
    twoStep?: TwoStepType
  }

  export interface CookieJsonType extends JWTPayload {
    requestedAppId: string;
    requestedAppAuthToken: string;
    requestedAppCallbackUrl: string;
  }
  
  export interface AppDataType {
    appIcon: string;
    appId: string;
    appName: string;
    appSecret: string;
    author: string;
    createdOn: Date | FieldValue;
    id: string;
    loginHidtory: LoginHistoryType;
    version: string;
    website: string;
    privacyPolicy: string;
    contact: string
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

export interface ApplicationBasicDataType {
  stockAppData: AppDataType;
  requestedAppData: AppDataType;
  brandData: BrandDataType
}

