"use client";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useContext, useState } from "react";
import userSignIn from "@/actions/database/userSignIn";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import signInFormSchema from "@/Schema/signInFormSchema";
import { AppBasicDataContext } from "@/app/auth/layout";
import Countdown from "@/components/universel/Countdown";
import { UserCredintialType, StatusType, TwoStepType, AppBasicDataType } from "@/types/types";
import { CgSpinner } from "react-icons/cg";
import { FaCheck, FaEye, FaEyeSlash } from "react-icons/fa";
import { RxCross1 } from "react-icons/rx";
import iconGoogle from "@/assets/icon_google.png";
import iconFacebook from "@/assets/icon_facebook.png";
import iconGithub from "@/assets/icon_github.svg";
import bgBanner from "@/assets/background_signin.jpg";


interface UserCredintialExtendedType extends UserCredintialType {
    twoStepCode?: number;
}

export default function Page() {

    const { stockAppData, brandData } = useContext(AppBasicDataContext) as AppBasicDataType;

    const [isLoading, setLoading] = useState<boolean>(false);
    const [isTwoStep, setTwoStep] = useState<TwoStepType>({
        isEnabled: false,
        expireOn: new Date()
    });
    const [isShowPassword, setShowPassword] = useState<boolean>(false);
    const [loginStatus, setLoginStatus] = useState<StatusType>({
        status: "initial",
        message: ""
    });

    const { register, formState: { errors }, getValues, handleSubmit } = useForm<UserCredintialExtendedType>({
        resolver: yupResolver(signInFormSchema)
    });

    const onSubmit: SubmitHandler<UserCredintialExtendedType> = async (data) => {
        setLoading(true);
        let response: StatusType;

        if (isTwoStep.isEnabled && (!data.twoStepCode || data.twoStepCode.toString().length !== 6)) {
            setLoginStatus({
                status: "error",
                message: "Invalid Verification code",
            });
            setLoading(false);
            return;
        }

        response = await userSignIn("credentials", { username: data.username, password: data.password }, data.twoStepCode);
        if (response) {
            if ('twoStep' in response) setTwoStep(response.twoStep as TwoStepType);
            setLoginStatus({ status: response.status, message: response.message });
        }

        setLoading(false);
    };

    const handleResend = async () => {
        const response = await userSignIn("credentials", { username: getValues("username"), password: getValues("password") });
        if ('twoStep' in response) setTwoStep(response.twoStep as TwoStepType);
    };

    return (
        <>
            <Head>
                <title>Sign In</title>
            </Head>
            <main className="min-h-screen w-full bg-cover bg-center relative">
                <Image src={bgBanner.src} alt="Background" fill priority />
                <div className="dark:bg-black dark:bg-opacity-50 relative">
                    <div className="min-h-screen container mx-auto flex items-center justify-center">

                        <section className="w-[400px] lg:w-[450px] bg-white dark:bg-gray-900 bg-opacity-95 dark:bg-opacity-95 p-8 lg:p-7 rounded-xl text-black dark:text-gray-200 shadow-lg">
                            <div className="flex justify-center space-x-2 items-center mb-10">
                                {stockAppData?.appIcon && <Image src={stockAppData.appIcon} alt={`${stockAppData.appName} logo`} width={30} height={30} />}
                                <p className="text-lg font-medium">{stockAppData?.appName}</p>
                            </div>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                                <div>
                                    <label className="block text-sm mb-1">Username or email</label>
                                    <input type="text" autoFocus={!isTwoStep} {...register("username")} disabled={isTwoStep.isEnabled} placeholder="Ex. michel92@random.com" aria-invalid={errors.username ? "true" : "false"} className="outline-none bg-transparent border-b block w-full border-gray-500 focus:border-blue-500 aria-invalid:focus:border-red-500 transition-all px-3 py-1 disabled:text-gray-500" />
                                    <p className="h-5 text-red-500 text-xs">{errors.username?.message}</p>
                                </div>

                                <div className="relative">
                                    <label className="block text-sm mb-1">Password</label>

                                    <input type={(isShowPassword && !isTwoStep.isEnabled) ? "text" : "password"} {...register("password")} disabled={isTwoStep.isEnabled} placeholder="" aria-invalid={errors.password ? "true" : "false"} className="outline-none bg-transparent border-b block w-full border-gray-500 focus:border-blue-500 aria-invalid:focus:border-red-500 transition-all px-3 py-1 disabled:text-gray-500" />
                                    <p className="h-5 text-red-500 text-xs">{errors.password?.message}</p>
                                    <button type="button" className="absolute right-3 top-7 text-gray-400 hover:text-gray-700 transition-all" onClick={() => setShowPassword(previousValue => !previousValue)}>
                                        {!isTwoStep.isEnabled && (isShowPassword ? <FaEye size={24} /> : <FaEyeSlash size={24} />)}
                                    </button>
                                </div>

                                {isTwoStep.isEnabled && (
                                    <div className="relative">
                                        <label className="block text-sm mb-1">Verification Code</label>
                                        <input type="number" {...register("twoStepCode")} autoFocus={isTwoStep.isEnabled} className="outline-none bg-transparent border-b block w-full border-gray-500 focus:border-blue-500 aria-invalid:focus:border-red-500 transition-all px-3 py-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                                        <div className="absolute right-0 bottom-1.5">
                                            <Countdown handleResend={handleResend} time={isTwoStep.expireOn} />
                                        </div>
                                    </div>
                                )}

                                {!isTwoStep.isEnabled && (
                                    <Link href="/auth/password-reset" className="text-sm text-blue-500 hover:text-blue-600 transition-all">Forgot password?</Link>
                                )}

                                <p className="text-gray-500 text-xs">
                                    <span>By logging in, you agree to our</span>&nbsp;
                                    <Link href="/privacy-policy" className="text-xs text-blue-500 hover:text-blue-600 transition-all">Privacy Policy</Link>
                                    <span>&nbsp;and&nbsp;</span>
                                    <Link href="/terms-and-condition" className="text-xs text-blue-500 hover:text-blue-600 transition-all">Terms of Service</Link>
                                    <span>, encompassing the responsible use of your data and adherence to platform guidelines.</span>
                                </p>

                                {loginStatus.message && (
                                    <div className={`py-1.5 rounded bg-opacity-20 ${loginStatus.status !== "error" ? "bg-green-500" : "bg-red-500"}`}>
                                        <p className={`px-3 flex items-center space-x-2 text-sm font-medium ${loginStatus.status !== "error" ? "text-green-500" : "text-red-500"}`}>
                                            {loginStatus.status !== "error" ? (
                                                <FaCheck size={16} />
                                            ) : (
                                                <RxCross1 size={16} />
                                            )}
                                            <span>{loginStatus.message}</span>
                                        </p>
                                    </div>
                                )}
                                <button type="submit" disabled={isLoading} className="bg-blue-500 hover:bg-blue-600 hover:text-gray-300 transition-all w-full mx-auto disabled:bg-gray-500 py-1.5 rounded-md text-white dark:text-gray-200 flex items-center justify-center space-x-2">
                                    {isLoading && <CgSpinner size={20} className="animate-spin" />}
                                    <p>{isLoading ? "Please wait..." : (isTwoStep.isEnabled ? "Submit" : "Login")}</p>
                                </button>
                            </form>

                            {!isTwoStep.isEnabled && (
                                <>
                                    <Link href="/auth/sign-up" className="text-blue-500 block mt-4 text-center hover:text-blue-600 transition-all">New user? Create an account now</Link>

                                    <div className="my-3 flex items-center space-x-3 px-6">
                                        <hr className="h-px bg-gray-400 border-0 w-full" />
                                        <p className="text-center text-gray-400">Or</p>
                                        <hr className="h-px bg-gray-400 border-0 w-full" />
                                    </div>

                                    <div className="space-y-2">
                                        <button type="button" onClick={async() => await userSignIn('google')} className="w-[350px] mx-auto border border-gray-900 dark:border-gray-400 hover:border-gray-500 dark:hover:bg-gray-800 dark:hover:border-gray-800 hover:bg-gray-100 transition-all rounded-md py-1 flex items-center justify-center space-x-2">
                                            <Image src={iconGoogle.src} alt="google icon" height={16} width={16} />
                                            <p>Continue with Google</p>
                                        </button>

                                        <button type="button" onClick={async() => await userSignIn('facebook')} className="w-[350px] mx-auto border border-gray-900 dark:border-gray-400 hover:border-gray-500 dark:hover:bg-gray-800 dark:hover:border-gray-800 hover:bg-gray-100 transition-all rounded-md py-1 flex items-center justify-center space-x-2">
                                            <Image src={iconFacebook.src} alt="facebook icon" height={16} width={16} />
                                            <p>Continue with Facebook</p>
                                        </button>

                                        <button type="button" onClick={async() => await userSignIn('github')} className="w-[350px] mx-auto border border-gray-900 dark:border-gray-400 hover:border-gray-500 dark:hover:bg-gray-800 dark:hover:border-gray-800 hover:bg-gray-100 transition-all rounded-md py-1 flex items-center justify-center space-x-2">
                                            <Image src={iconGithub.src} alt="github icon" height={16} width={16} />
                                            <p>Continue with GitHub</p>
                                        </button>
                                    </div>
                                </>
                            )}
                        </section>
                    </div>
                </div>

                <footer className="absolute bottom-2 w-full z-30">
                    <p className="text-center text-white dark:text-gray-200 ">{brandData.copyrightText}</p>
                </footer>
            </main>
        </>
    );

}
