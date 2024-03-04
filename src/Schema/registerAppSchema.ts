import * as yup from "yup";

const registerAppSchema = yup.object().shape({
    appName: yup.string()
        .required('App name is required')
        .min(3, 'App name must be at least 3 characters')
        .max(32, 'App name must not exceed 32 characters'),
    appType: yup.string()
        .required('App type is required')
        .oneOf(['web application', 'android application', 'ios application', 'desktop application'], 'Invalid app type'),
    description: yup.string()
        .default("")
        .max(600, 'App name must not exceed 600 characters'),
    inactiveMessage: yup.string()
        .required('Inactive Message is required when status is inactive')
        .when('status', (is) => {
            if (is[0] === "inactive") return yup.string().min(10, 'Inactive message must be at least 10 characters');
            return yup.string().default('').max(100, 'Inactive message should not exceed 100 characters');
        }),
    version: yup.string()
        .required('Version is required')
        .min(3, 'Version must be at least 3 characters')
        .max(10, 'Version must not exceed 10 characters'),
    status: yup.string()
        .required('Status is required')
        .oneOf(['active', 'inactive'], 'Invalid status'),
    redirectUrl: yup.string()
        .required('Redirect URL is required')
        .url('Invalid URL format for redirect URL'),
    contact: yup.string()
        .required('Contact email is required')
        .email('Invalid email format for contact'),
    website: yup.string()
        .required('Website URL is required')
        .url('Invalid URL format for website'),
    privacyPolicy: yup.string()
        .required('Privacy policy URL is required')
        .url('Invalid URL format for privacy policy'),
    appIcon: yup.string()
});

export default registerAppSchema;