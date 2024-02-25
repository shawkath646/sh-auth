import * as yup from "yup";

const signInFormSchema = yup.object().shape({
    username: yup.string().required("Email or username is required!").matches(/^[a-z0-9]+@[a-z0-9.-]+\.[a-z]{2,}$/i, "Input value is neither an email nor a username"),
    password: yup.string().required("Password is required!").min(8, "Minimum 8 character required!").max(32, "Maximum 32 character allowed!"),
    twoStepCode: yup.number()
});

export default signInFormSchema;