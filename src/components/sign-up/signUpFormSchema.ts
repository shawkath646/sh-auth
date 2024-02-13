import * as yup from "yup";

const signUpFormSchema = yup.object().shape({
    firstName: yup.string().required("First name is required!").min(3, 'First name must be at least 3 characters').max(32, 'First name cannot exceed 32 characters'),
    lastName: yup.string().required("Last name is required!").min(3, 'Last name must be at least 3 characters').max(32, 'Last name cannot exceed 32 characters'),
    email: yup.string().email('Invalid email provided').required('Email is required!'),
    password: yup.string().required("Password is required!").min(8, 'Password must be at least 8 characters').max(32, 'Password cannot exceed 32 characters')
        .matches(
            /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d\s]{8,}$/,
            "Password must contain at least one letter and one number"
        ),
    confirmPassword: yup.string().required("Confirm password is required!").min(8, 'Confirm password must be at least 8 characters').max(32, 'Confirm password cannot exceed 32 characters')
        .oneOf([yup.ref("password")], "Passwords doesn't match"),
    countryCode: yup.string().required("Country code is required!"),
    phoneNumber: yup.string().required("Phone number is required!").min(5, 'Phone number must be at least 5 characters').max(15, 'Phone number cannot exceed 15 characters'),
    dateOfBirth: yup.date().required('Date of birth is required')
        .test('age', 'User must be at least 13 years old', function(value) {
        const currentDate = new Date();
        const thirteenYearsAgo = new Date(currentDate.getFullYear() - 13, currentDate.getMonth(), currentDate.getDate());
        
        return value && value <= thirteenYearsAgo;
    }),
    gender: yup.string().required('Gender is required!').oneOf(['male', 'female', 'others'], 'Invalid gender value'),
    country: yup.string().min(3, 'Country must be at least 3 characters').max(32, 'Country cannot exceed 32 characters').required("Country is required!"),
    image: yup.string(),
});

export default signUpFormSchema;