import { UserDataType } from "@/types/types";

const userObject: UserDataType = {
    id: "",
    personalData: {
        firstName: "",
        lastName: "",
        address: {
            present: {
                street: "",
                postalCode: 0,
                city: "",
                state: "",
                country: ""
            },
            permanent: {
                street: "",
                postalCode: 0,
                city: "",
                state: "",
                country: ""
            },
        },
        dateOfBirth: new Date(),
        gender: "",
        image: ''
    },
    contactInfo: {
        email: [
            {
                type: "primary",
                address: "",
                verified: false
            }
        ],
        phoneNumber: [
            {
                countryCode: "",
                number: "",
                verified: false
            }
        ]
    },
    permissions: [],
    username: "",
    loginInfo: {
        createdBy: {
            userAgent: "",
            clientIp: "",
            clientLocation: {},
            timestamp: new Date(),
        },
        twoFactor: {
            isEnabled: false,
            address: "",
            type: ""
        },
        isSuspended: false,
        loginHistory: []
    },
    password: "",
    isEnterpriseUser: false
};

export default userObject;