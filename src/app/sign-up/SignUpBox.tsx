"use client";
import Link from "next/link";
import Image from "next/image";
import { Fragment, useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import newUserRegistration from "@/actions/database/newUserRegistration";
import { Listbox, RadioGroup, Transition } from "@headlessui/react";
import InputBox from "@/app/sign-up/InputBox";
import ReactDatePicker from "react-datepicker";
import PictureUpload from "@/components/universel/PictureUpload";
import signUpFormSchema from "@/Schema/signUpFormSchema";
import userSignIn from "@/actions/database/userSignIn";
import { RegistrationBoxInputType, StatusType } from "@/types/types";
import { CgSpinner } from "react-icons/cg";
import { FaCheck } from "react-icons/fa6";
import { RxCross1 } from "react-icons/rx";
import CountryCodeList from "@/JsonData/CountryCodeList.json";
import MessageList from "@/JsonData/MessagesList.json";
import "react-datepicker/dist/react-datepicker.css";
import registrationBoxCover from "@/assets/registration_box_cover.jpg";


export default function SignUpBox({ stockAppIcon, stockAppName }: { stockAppIcon: string; stockAppName: string }) {

    const [signupStatus, setSignupStatus] = useState<StatusType>({ status: "initial", message: "" });
    const [isLoading, setLoading] = useState<boolean>(false);

    const { control, register, formState: { errors }, handleSubmit, clearErrors, setError } = useForm<RegistrationBoxInputType>({
        resolver: yupResolver(signUpFormSchema),
    });

    const onSubmit: SubmitHandler<RegistrationBoxInputType> = async (data) => {
        try {
            setLoading(true);

            const registrationResponse = await newUserRegistration(data);
            setSignupStatus(registrationResponse as StatusType);

            if (registrationResponse.status === "registred") {
                const loginResponse = await userSignIn("credentials", {
                    username: data.email,
                    password: data.password,
                });

                if (loginResponse) setSignupStatus(loginResponse as StatusType);
            }
            setLoading(false);
        } catch (error) {
            setSignupStatus({ status: "error", message: error?.toString() || MessageList.M009.message });
        }
    };


    return (
        <form onSubmit={handleSubmit(onSubmit)} className="w-full lg:w-[800px] lg:flex scrollbar-hide md:shadow-xl md:rounded-xl bg-white dark:bg-gray-900 text-black dark:text-gray-200 pb-10 lg:pb-0">
            <section className="relative hidden lg:block rounded-xl overflow-hidden w-[550px]">
                <Image src={registrationBoxCover.src} alt="Registration box cover" fill />
                <div className="absolute top-10 left-20">
                    <Controller
                        name="image"
                        control={control}
                        defaultValue=''
                        render={({ field }) => (
                            <PictureUpload
                                alt="Register app icon"
                                name="image"
                                currentImage={field.value}
                                onChange={field.onChange}
                                error={errors.image}
                                clearErrors={clearErrors}
                                setError={setError}
                                imageSize={80}
                                maxSize={3000000}
                                containerClassName="space-y-2"
                            />
                        )}
                    />
                </div>
                <p className="absolute bottom-0 text-3xl px-4 pt-10 pb-6 text-white dark:text-gray-200 bg-gradient-to-t from-black via-black">We protect your privacy</p>
            </section>
            <section className="p-5 lg:p-6 w-full">
                <div className="flex items-center justify-center space-x-2 mx-auto">
                    {stockAppIcon && <Image src={stockAppIcon} alt={`${stockAppName} logo`} width={30} height={30} className="h-[30px] w-[30px]" />}
                    <p className="text-lg font-medium">{stockAppName}</p>
                </div>
                <p className="text-sm text-center mt-2 text-violet-500 font-medium mb-5">Before you go please fill up this form</p>
                <div className="space-y-3">
                    <Controller
                        name="image"
                        control={control}
                        defaultValue=''
                        render={({ field }) => (
                            <PictureUpload
                                alt="Register app icon"
                                name="image"
                                currentImage={field.value}
                                onChange={field.onChange}
                                error={errors.image}
                                clearErrors={clearErrors}
                                setError={setError}
                                maxSize={3000000}
                                imageSize={80}
                                containerClassName="flex items-center justify-center space-x-3 lg:hidden"
                            />
                        )}
                    />
                    <div className="grid md:grid-cols-2 gap-3">
                        <InputBox
                            type="text"
                            label="First Name"
                            {...register("firstName")}
                            error={errors.firstName}
                            placeholder="John"
                        />
                        <InputBox
                            type="text"
                            label="Last Name"
                            {...register("lastName")}
                            error={errors.lastName}
                            placeholder="Doe"
                        />
                    </div>
                    <InputBox
                        type="email"
                        label="Email"
                        {...register("email")} placeholder="john.doe@example.com" aria-invalid={errors.email ? "true" : "false"}
                        error={errors.email}
                    />
                    <div>
                        <label className="text-sm font-bold text-gray-500">Phone Number</label>
                        <div className="flex justify-center space-x-2">
                            <Controller
                                name="countryCode"
                                defaultValue=""
                                control={control}
                                render={({ field }) => (
                                    <Listbox as="div" value={field.value} onChange={field.onChange}>
                                        <Listbox.Button className="w-[130px] block py-2 px-2 rounded-lg outline-none border text-sm bg-gray-100 dark:bg-gray-700 aria-invalid:border-red-500 border-gray-200 dark:border-gray-700 focus:border-violet-600 read-only:text-gray-400 dark:text-gray-300 transition-all">
                                            <span className="block truncate">{field.value || "Select Country code"}</span>
                                        </Listbox.Button>
                                        <Transition
                                            as={Fragment}
                                            leave="transition ease-in duration-100"
                                            leaveFrom="opacity-100"
                                            leaveTo="opacity-0"
                                        >
                                            <Listbox.Options className="absolute z-50 mt-1 max-h-60 w-[250px] overflow-auto rounded-md bg-white dark:bg-gray-800 py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm scrollbar-hide">
                                                {CountryCodeList.map((countryCode, index) => (
                                                    <Listbox.Option
                                                        key={index}
                                                        className={({ active }) =>
                                                            `relative cursor-default select-none py-2 px-3 flex items-center justify-between space-x-2 ${active ? 'bg-violet-600 bg-opacity-20 text-violet-400' : 'text-gray-900 dark:text-gray-300'
                                                            }`
                                                        }
                                                        value={countryCode.code}
                                                    >
                                                        {({ selected }) => (
                                                            <>
                                                                <span
                                                                    className={`block truncate ${selected ? 'font-medium' : 'font-normal'
                                                                        }`}
                                                                >
                                                                    {countryCode.country}
                                                                </span>
                                                                <span
                                                                    className={`block truncate ${selected ? 'font-medium' : 'font-normal'
                                                                        }`}
                                                                >
                                                                    {countryCode.code}
                                                                </span>
                                                            </>
                                                        )}
                                                    </Listbox.Option>
                                                ))}
                                            </Listbox.Options>
                                        </Transition>
                                        {errors.countryCode && <p className="text-xs text-red-500">{errors.countryCode.message}</p>}
                                    </Listbox>
                                )}
                            />
                            <div className="w-full">
                                <input
                                    type="tel"
                                    {...register("phoneNumber")} aria-invalid={errors.phoneNumber ? "true" : "false"}
                                    placeholder="1234567890"
                                    className="block py-2 px-2 rounded-lg outline-none border text-sm bg-gray-100 dark:bg-gray-700 aria-invalid:border-red-500 border-gray-200 dark:border-gray-700 focus:border-violet-600 read-only:text-gray-400 dark:text-gray-300 transition-all w-full"
                                />
                                {errors.phoneNumber && <p className="text-xs text-red-500">{errors.phoneNumber.message}</p>}
                            </div>
                        </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-3">
                        <InputBox
                            type="password"
                            label="Password"
                            {...register("password")}
                            error={errors.password}
                            placeholder="password123"

                        />
                        <InputBox
                            type="password"
                            label="Confirm Password"
                            {...register("confirmPassword")}
                            error={errors.confirmPassword}
                            placeholder="password123"
                        />
                    </div>

                </div>
                <div className="grid lg:grid-cols-2 gap-3">
                    <div>
                        <label className="text-sm font-bold text-gray-500">Date of Birth</label>
                        <Controller
                            name="dateOfBirth"
                            control={control}
                            render={({ field }) => (
                                <div className="customDatePickerWidth">
                                    <ReactDatePicker
                                        selected={field.value}
                                        onChange={field.onChange}
                                        dateFormat="yyyy-MM-dd"
                                        placeholderText="yyyy-MM-dd"
                                        className="block py-2 px-2 rounded-lg outline-none border text-sm bg-gray-100 dark:bg-gray-700 aria-invalid:border-red-500 border-gray-200 dark:border-gray-700 focus:border-violet-600 read-only:text-gray-400 dark:text-gray-300 transition-all w-full"
                                    />
                                    {errors.dateOfBirth && <p className="text-xs text-red-500">{errors.dateOfBirth.message}</p>}
                                </div>
                            )}
                        />
                    </div>
                    <div>
                        <label className="text-sm font-bold text-gray-500">Gender</label>
                        <Controller
                            name="gender"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <RadioGroup value={field.value} onChange={field.onChange} className="flex items-center justify-between my-2">
                                    <RadioGroup.Option value="male">
                                        {({ checked }) => (
                                            <span className={`px-2 text-sm py-0.5 rounded-md outline-none cursor-pointer transition-all ${checked ? 'bg-violet-500 text-white' : 'bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-800 hover:bg-gray-300'}`}>Male</span>
                                        )}
                                    </RadioGroup.Option>
                                    <RadioGroup.Option value="female">
                                        {({ checked }) => (
                                            <span className={`px-2 text-sm py-0.5 rounded-md outline-none cursor-pointer transition-all ${checked ? 'bg-violet-500 text-white' : 'bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-800 hover:bg-gray-300'}`}>Female</span>
                                        )}
                                    </RadioGroup.Option>
                                    <RadioGroup.Option value="others">
                                        {({ checked }) => (
                                            <span className={`px-2 text-sm py-0.5 rounded-md outline-none cursor-pointer transition-all ${checked ? 'bg-violet-500 text-white' : 'bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-800 hover:bg-gray-300'}`}>Others</span>
                                        )}
                                    </RadioGroup.Option>
                                </RadioGroup>
                            )}
                        />
                        {errors.gender && <p className="text-xs text-red-500">{errors.gender.message}</p>}
                    </div>
                </div>
                <Controller
                    control={control}
                    name="country"
                    defaultValue=""
                    render={({ field }) => (
                        <Listbox onChange={field.onChange}>
                            <Listbox.Button className="mt-3 text-left relative block py-1.5 px-2 rounded-lg outline-none border text-sm bg-gray-100 dark:bg-gray-700 aria-invalid:border-red-500 border-gray-200 dark:border-gray-700 focus:border-violet-600 read-only:text-gray-400 dark:text-gray-300 transition-all w-full">{field.value || "Select country"}</Listbox.Button>

                            <Transition
                                as={Fragment}
                                leave="transition ease-in duration-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <Listbox.Options className="absolute mt-1 max-h-60 w-[250px] overflow-auto rounded-md bg-white dark:bg-gray-800 py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm scrollbar-hide">
                                    {CountryCodeList.map(({ country }, index) => (
                                        <Listbox.Option key={index} value={country} className={({ active }) =>
                                            `relative cursor-default select-none py-2 px-3 flex items-center justify-between space-x-2 ${active ? 'bg-violet-600 bg-opacity-20 text-violet-400' : 'text-gray-900 dark:text-gray-300'
                                            }`
                                        }>
                                            {({ selected }) => (
                                                <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>{country}</span>
                                            )}
                                        </Listbox.Option>
                                    ))}
                                </Listbox.Options>
                            </Transition>
                            {errors.country && <p className="text-xs text-red-500">{errors.country.message}</p>}
                        </Listbox>
                    )}

                />
                {signupStatus.message && (
                    <div className={`py-1.5 rounded bg-opacity-20 mt-5 ${(signupStatus.status !== "error") ? "bg-green-500" : "bg-red-500"}`}>
                        <p className={`px-3 flex items-center space-x-2 text-sm font-medium ${(signupStatus.status !== "error") ? "text-green-500" : "text-red-500"}`}>
                            {(signupStatus.status !== "error") ? (
                                <FaCheck size={16} />
                            ) : (
                                <RxCross1 size={16} />
                            )}
                            <span>{signupStatus.message}</span>
                        </p>
                    </div>
                )}

                <p className="text-gray-500 text-xs mt-3">
                    <span>By signup, you agree to our</span>&nbsp;
                    <Link href="/privacy-policy" className="text-xs text-blue-500 hover:text-blue-600 transition-all">Privacy Policy</Link>
                    <span>&nbsp;and&nbsp;</span>
                    <Link href="/terms-and-condition" className="text-xs text-blue-500 hover:text-blue-600 transition-all">Terms of Service</Link>
                    <span>, encompassing the responsible use of your data and adherence to platform guidelines.</span>
                </p>

                <button type="submit" disabled={isLoading} className="flex items-center space-x-2  justify-center mt-5 bg-violet-500 hover:bg-violet-600 shadow-xl outline-none shadow-violet-300 dark:shadow-violet-900 text-white disabled:bg-gray-400 hover:text-gray-200 py-1.5 w-full rounded-md transition-all">
                    {isLoading && <CgSpinner size={20} className="animate-spin" />}
                    <p>{isLoading ? "Please wait..." : "Confirm"}</p>
                </button>
            </section>
        </form>
    );
}