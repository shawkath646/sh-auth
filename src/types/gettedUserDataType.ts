import { FieldValue } from "firebase-admin/firestore";

export interface DateOfBirth {
    _seconds: number;
    _nanoseconds: number;
  }
  
  export interface PhoneNumber {
    number: string;
    countryCode: string;
    verified: boolean;
  }
  
  export interface Email {
    address: string;
    type: string;
    verified: boolean;
  }
  
  export interface Address {
    country: string;
    city: string;
    street: string;
    postalCode: number;
    state: string;
  }
  
  export interface PersonalData {
    firstName: string;
    lastName: string;
    dateOfBirth: DateOfBirth | Date | FieldValue;
    gender: string;
    image: string;
    address: {
      permanent: Address;
      present: Address;
    };
  }
  
  export interface Permission {
    role: string;
    app_id: string;
  }
  
  export interface ContactInfo {
    phoneNumber: PhoneNumber[];
    email: Email[];
  }

  export interface LoginHistory {
    userAgent: string;
    clientIp: string;
    clientLocation: string;
    timestamp?: DateOfBirth | Date | FieldValue;
    refreshToken?: {
      token: string;
      expireOn: Date;
    };
  }
  
  export interface LoginInfo {
    createdBy: LoginHistory;
    isSuspended: boolean;
    loginHistory: LoginHistory[];
  }
  
  export default interface GettedUserData {
    id: string;
    username: string;
    permissions: Permission[];
    contactInfo: ContactInfo;
    personalData: PersonalData;
    loginInfo: LoginInfo;
    password?: string;
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
      permissions?: Permission[];
      contactInfo?: ContactInfo;
      personalData?: PersonalData;
      loginInfo?: LoginInfo;
      newUser? :boolean;
    }
    expires: string
  }
  
  export type PagePropsType = {
    params: {},
    searchParams: { [key: string]: string | string[] | undefined },
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
    callbackUrl: string;
  }

  export interface RegistrationModalDataType {
    isOpen: boolean;
    success: boolean;
    code: number;
    message: string;
  }