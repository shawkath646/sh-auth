"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Fragment, useRef, useState } from "react";
import { signIn } from "next-auth/react";
import { Popover, Transition } from "@headlessui/react";
import { useForm, SubmitHandler } from "react-hook-form";
import { CgSpinner } from "react-icons/cg";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import iconGoogle from "@/assets/icon_google.png";
import iconFacebook from "@/assets/icon_facebook.png";
import iconGithub from "@/assets/icon_github.svg";
import { BoxPropsType } from "@/types/gettedUserDataType";


interface IFormInput {
    email: string;
    password: string;
}

interface ErrorStatus {
    code: number;
    message: string;
}


export default function SignInBox({ stockAppData, callbackUrl }: BoxPropsType) {

    const [isLoading, setLoadng] = useState<boolean>(false);
    const [isShowPassword, setShowPassword] = useState<boolean>(false);
    const [errorStatus, setErrorStatus] = useState<ErrorStatus>({ code: 0, message: "" });

    const router = useRouter();

    const { register, formState: { errors }, handleSubmit, setError } = useForm<IFormInput>();
    const popOverButtonRef = useRef<HTMLButtonElement | null>(null);

    const callbackUrlLink = `/auth/sign-up?${callbackUrl}`;

    const onSubmit: SubmitHandler<IFormInput> = async(data) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const usernameRegex = /^[a-zA-Z0-9]+$/;
    
        if (!emailRegex.test(data.email) && !usernameRegex.test(data.email)) return setError("email", { message: "Input value is neither an email nor a username"}, { shouldFocus: true });
    
        setLoadng(true);
        
        const response = await signIn("credentials", { username: data.email, password: data.password, redirect: false });
      
        if (!response?.error) return router.push(callbackUrlLink);
        
        setLoadng(false);

        const errorObject = JSON.parse(response?.error || '{"status":{"code":505,"message":"Unknown Error! Please try again or contact to our support."},"user":null}');
    
        setErrorStatus(errorObject.status);
    
        popOverButtonRef.current?.click();
    };

    return (
        <section className="w-[400px] lg:w-[500px] bg-white dark:bg-gray-900 bg-opacity-95 p-8 lg:p-7 rounded-xl text-black dark:text-gray-200 shadow-lg">
            <div className="flex justify-center space-x-2 items-center mb-10">
                {stockAppData?.icon && <Image src={stockAppData.icon} alt={`${stockAppData.name} logo`} width={30} height={30} />}
                <p className="text-lg font-medium">{stockAppData?.name}</p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                <div>
                    <label className="block text-sm mb-1">Username or email</label>
                    <input type="text" autoFocus {...register("email", { required: { value: true, message: "Email or username is required!" }, minLength: { value: 5, message: "Minimum 5 character required!" }, maxLength: { value: 32, message: "Maximum 32 character allowed!" } })} placeholder="Ex. michel92@random.com" aria-invalid={errors.email ? "true" : "false"} className="outline-none bg-transparent border-b block w-full border-gray-500 focus:border-blue-500 aria-invalid:focus:border-red-500 transition-all px-3 py-1" />
                    <p className="h-5 text-red-500 text-xs">{errors.email?.message}</p>
                </div>

                <div className="relative">
                    <label className="block text-sm mb-1">Password</label>

                    <input type={isShowPassword ? "text" : "password"} {...register("password", { required: { value: true, message: "Password is required!" }, minLength: { value: 8, message: "Minimum 8 character required!" }, maxLength: { value: 32, message: "Maximum 32 character allowed!" } })} placeholder="" aria-invalid={errors.password ? "true" : "false"} className="outline-none bg-transparent border-b block w-full border-gray-500 focus:border-blue-500 aria-invalid:focus:border-red-500 transition-all px-3 py-1" />
                    <p className="h-5 text-red-500 text-xs">{errors.password?.message}</p>
                    <button type="button" className="absolute right-3 top-7 text-gray-400 hover:text-gray-700 transition-all" onClick={() => setShowPassword(previousValue => !previousValue)}>
                        {isShowPassword ? <FaEye size={24} /> : <FaEyeSlash size={24} />}
                    </button>
                </div>

                <Link href={`/auth/password-reset?${callbackUrl}`} className="text-sm text-blue-500 hover:text-blue-600 transition-all">Forgot password?</Link>

                <p className="text-gray-500 text-xs">
                    <span>By logging in, you agree to our</span>&nbsp;
                    <Link href="/privacy-policy" className="text-xs text-blue-500 hover:text-blue-600 transition-all">Privacy Policy</Link>
                    <span>&nbsp;and&nbsp;</span>
                    <Link href="/terms-and-condition" className="text-xs text-blue-500 hover:text-blue-600 transition-all">Terms of Service</Link>
                    <span>, encompassing the responsible use of your data and adherence to platform guidelines.</span>
                </p>

                <Popover className="relative">
                    <button type="submit" disabled={isLoading} className="bg-blue-500 hover:bg-blue-600 hover:text-gray-300 transition-all w-full mx-auto disabled:bg-gray-500 py-1.5 rounded-md text-white dark:text-gray-200 flex items-center justify-center space-x-2">
                        {isLoading && <CgSpinner size={20} className="animate-spin" />}
                        <p>{isLoading ? "Please wait..." : "Login"}</p>
                    </button>

                    <Popover.Button ref={popOverButtonRef} hidden>Popover Button</Popover.Button>

                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-1"
                    >
                        <Popover.Panel static className="absolute left-1/2 z-10 mt-3 w-[380px] lg:w-[400px] -translate-x-1/2 transform">
                        <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black/5 bg-violet-200 p-6">
                            <p className="text-xl text-red-500">Error: {errorStatus.code}</p>
                            <p className="mt-3">{errorStatus.message}</p>
                        </div>
                        </Popover.Panel>
                    </Transition>
                </Popover>
            </form>

            <Link href={`/auth/sign-up?${callbackUrl}`} className="text-blue-500 block mt-4 text-center hover:text-blue-600 transition-all">New user? Create an account now</Link>

            <div className="my-3 flex items-center space-x-3 px-6">
                <hr className="h-px bg-gray-400 border-0 w-full" />
                <p className="text-center text-gray-400">Or</p>
                <hr className="h-px bg-gray-400 border-0 w-full" />
            </div>

            <div className="space-y-2">
                <button type="button" onClick={() => signIn('google', { callbackUrl: callbackUrlLink })} className="w-[350px] mx-auto border border-gray-900 dark:border-gray-400 hover:border-gray-500 dark:hover:bg-gray-800 dark:hover:border-gray-800 hover:bg-gray-100 transition-all rounded-md py-1 flex items-center justify-center space-x-2">
                    <Image src={iconGoogle.src} alt="google icon" height={16} width={16} />
                    <p>Continue with Google</p>
                </button>

                <button type="button" onClick={() => signIn('facebook', { callbackUrl: callbackUrlLink })} className="w-[350px] mx-auto border border-gray-900 dark:border-gray-400 hover:border-gray-500 dark:hover:bg-gray-800 dark:hover:border-gray-800 hover:bg-gray-100 transition-all rounded-md py-1 flex items-center justify-center space-x-2">
                    <Image src={iconFacebook.src} alt="facebook icon" height={16} width={16} />
                    <p>Continue with Facebook</p>
                </button>

                <button type="button" onClick={() => signIn('github', { callbackUrl: callbackUrlLink })} className="w-[350px] mx-auto border border-gray-900 dark:border-gray-400 hover:border-gray-500 dark:hover:bg-gray-800 dark:hover:border-gray-800 hover:bg-gray-100 transition-all rounded-md py-1 flex items-center justify-center space-x-2">
                    <Image src={iconGithub.src} alt="github icon" height={16} width={16} />
                    <p>Continue with GitHub</p>
                </button>
            </div>
        </section>
    );

}