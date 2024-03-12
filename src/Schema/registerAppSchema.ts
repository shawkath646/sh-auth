import * as yup from "yup";

const registerAppSchema = yup.object().shape({
    appIcon: yup.string(),
    appName: yup.string()
        .required('App name is required')
        .min(3, 'App name must be at least 3 characters')
        .max(32, 'App name must not exceed 32 characters'),
    description: yup.string()
        .max(600, 'App description must not exceed 600 characters'),
    appType: yup.string()
        .required('App type is required')
        .oneOf(['web application', 'android application', 'ios application', 'desktop application'], 'Invalid app type'),
    version: yup.string()
        .required('Version is required')
        .min(3, 'Version must be at least 3 characters')
        .max(10, 'Version must not exceed 10 characters'),
    website: yup.string()
        .required('Website URL is required')
        .url('Invalid URL format for website'),
    contact: yup.string()
        .required('Contact email is required')
        .email('Invalid email format for contact'),
    status: yup.string()
        .required('Status is required')
        .oneOf(['active', 'inactive'], 'Invalid status'),
    inactiveMessage: yup.string()
        .min(10, 'Inactive message must be at least 10 characters')
        .max(600, 'Inactive message should not exceed 600 characters')
        .when('status', (is) => {
            if (is[0] === "inactive") return yup.string()
                .required('Inactive Message is required when status is inactive');
            return yup.string();
        }),
    inactiveUntil: yup.date()
        .nullable()
        .min(new Date(), 'Inactive until date must be in the future'),
    pageAlertMessage: yup.string()
        .max(600, 'Page alert message should not exceed 600 characters'),
    pageAlertAction: yup.string()
        .url()
        .max(1000, 'Page alert message should not exceed 1000 characters'),
    redirectUrl: yup
        .array()
        .required()
        .default([])
        .of(
            yup.string()
                .required('Redirect URL is required')
                .test('is-url', 'Invalid URL format for redirect URL', (value) => {
                    try {
                        const url = new URL(value);
                        return url.hostname === 'localhost' || /^\d+\.\d+\.\d+\.\d+$/.test(url.hostname) || /^(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/.test(url.hostname);
                    } catch (error) {
                        return false;
                    }
                })
        ),
    privacyPolicy: yup.string()
        .url('Invalid URL format for privacy policy'),
});

export default registerAppSchema;