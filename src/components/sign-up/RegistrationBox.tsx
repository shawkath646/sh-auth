"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { Fragment, useEffect, useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import { Listbox, RadioGroup, Transition } from "@headlessui/react";
import ReactDatePicker from "react-datepicker";
import InputBox from "./InputBox";
import PictureUpload from "../universel/PictureUpload";
import { CgSpinner } from "react-icons/cg";
import registrationBoxCover from "@/assets/registration_box_cover.jpg";
import "react-datepicker/dist/react-datepicker.css";
import { BoxPropsType, RegistrationBoxInputType, RegistrationModalDataType } from "@/types/gettedUserDataType";
import signUpFormSchema from "./signUpFormSchema";
import CountryCodeList from "@/lib/CountryCodeList.json";
import { userRegistration } from "@/lib/database/userManager";
import RegistrationModal from "./RegistrationModal";

interface ResponseType {
    code: number,
    message: string;
    success: boolean;
}

                
export default function RegistrationBox({ stockAppData, callbackUrl }: BoxPropsType) {

    const initialModalData = {
        isOpen: false,
        success: true,
        code: 0,
        message: ""
    }

    const [modalData, setModalData] = useState<RegistrationModalDataType>(initialModalData)
    const [isLoading, setLoading] = useState<boolean>(false);

    const { data: session, update } = useSession();

    const router = useRouter();


    const { control, register, formState: { errors }, handleSubmit, clearErrors, setError, getValues, setValue } = useForm<RegistrationBoxInputType>({
        resolver: yupResolver(signUpFormSchema),
    });

    useEffect(() => {
        if (session?.user?.email) {
            setValue('email', session.user.email);
            const nameParts = session?.user.name.trim().split(/\s+/);
            const lastName = nameParts.pop();
            const firstName = nameParts.join(" ");
            setValue('firstName', firstName);
            setValue('lastName', lastName);
        }
    }, [session, setValue]);

    const callbackUrlLink = `/auth/user-info?${callbackUrl}`;

    const onSubmit: SubmitHandler<RegistrationBoxInputType> = async(data) => {
        setLoading(true);
        const response = await userRegistration(data);
        setModalData({
            isOpen: true,
            ...response as ResponseType
        })
        setLoading(false);
    }

    const modalCallback = async () => {
        if (!modalData.success) {
          setModalData(initialModalData);
          return;
        }
      
        if (!session) {
            const response = await signIn("credentials", {
                username: getValues("email"),
                password: getValues("password"),
                redirect: false,
                callbackUrl: callbackUrlLink
            });
      
          if (!response?.ok) {
            const errorObject = JSON.parse(response?.error || '{"status":{"code":505,"message":"Unknown Error! Please try again or contact to our support."},"user":null}');
            setModalData({
              isOpen: true,
              success: false,
              code: errorObject.status.code || 0,
              message: errorObject.status.message
            });
            return;
          }
        }
      
        await update();
        router.push(callbackUrlLink);
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
                                alt="User profile"
                                currentImage={field.value}
                                previousImage={session?.user.personalData?.image || session?.user.image}
                                onChange={field.onChange}
                                maxSize={3000000}
                                clearError={clearErrors}
                                error={errors.image}
                                setError={setError}
                                containerClassName="space-y-2 bg-gradient-to-tr from-emerald-700 to-indigo-700 p-3 rounded-md"
                            />
                        )}
                    />
                </div>
                <p className="absolute bottom-0 text-3xl px-4 pt-10 pb-6 bg-gradient-to-t from-black via-black">We protect your privacy</p>
            </section>
            <section className="p-5 lg:p-6 w-full">
                <div className="flex justify-center space-x-2 items-center">
                    {stockAppData?.icon && <Image src={stockAppData.icon} alt={`${stockAppData.name} logo`} width={30} height={30} />}
                    <p className="text-lg font-medium">{stockAppData?.name}</p>
                </div>
                <p className="text-sm text-center mt-2 text-violet-500 font-medium mb-5">Before you go please fill up this form</p>
                <div className="space-y-3">
                    <Controller
                        name="image"
                        control={control}
                        defaultValue=''
                        render={({ field }) => (
                            <PictureUpload
                                alt="User profile"
                                currentImage={field.value}
                                previousImage={session?.user.personalData?.image || session?.user.image}
                                onChange={field.onChange}
                                maxSize={3000000}
                                clearError={clearErrors}
                                error={errors.image}
                                setError={setError}
                                containerClassName="mx-auto flex items-center justify-center space-x-2 lg:hidden"
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
                        readOnly={session?.user.email}
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
                                    <Listbox value={field.value} onChange={field.onChange}>
                                        <div className="relative z-50">
                                            <Listbox.Button className="w-[130px] block py-2 px-2 rounded-lg outline-none border text-sm bg-gray-100 dark:bg-gray-700 aria-invalid:border-red-500 border-gray-200 dark:border-gray-700 focus:border-violet-600 read-only:text-gray-400 dark:text-gray-300 transition-all">
                                                {field.value ? <span className="block truncate">{field.value}</span> : <span className="text-gray-400">Country code</span>}
                                            </Listbox.Button>
                                            <Transition
                                                as={Fragment}
                                                leave="transition ease-in duration-100"
                                                leaveFrom="opacity-100"
                                                leaveTo="opacity-0"
                                            >
                                                <Listbox.Options className="absolute mt-1 max-h-60 w-[250px] overflow-auto rounded-md bg-white dark:bg-gray-800 py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                                                {CountryCodeList.map((countryCode, index) => (
                                                    <Listbox.Option
                                                        key={index}
                                                        className={({ active }) =>
                                                            `relative cursor-default select-none py-2 px-3 flex items-center justify-between space-x-2 ${
                                                            active ? 'bg-violet-600 bg-opacity-20 text-violet-400' : 'text-gray-900 dark:text-gray-300'
                                                            }`
                                                        }
                                                        value={countryCode.code}
                                                    >
                                                        {({ selected }) => (
                                                            <>
                                                                <span
                                                                    className={`block truncate ${
                                                                    selected ? 'font-medium' : 'font-normal'
                                                                    }`}
                                                                >
                                                                    {countryCode.country}
                                                                </span>
                                                                <span
                                                                    className={`block truncate ${
                                                                    selected ? 'font-medium' : 'font-normal'
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
                                        </div>
                                        
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
                                        onChange={(date) => field.onChange(date)}
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
                <InputBox
                    label="Country"
                    type="text"
                    {...register("country")}
                    error={errors.country}
                    placeholder="United States"
                />


                <button type="submit" disabled={isLoading} className="flex items-center space-x-2  justify-center mt-5 bg-violet-500 hover:bg-violet-600 shadow-xl outline-none shadow-violet-300 dark:shadow-violet-900 text-white disabled:bg-gray-400 hover:text-gray-200 py-1.5 w-full rounded-md transition-all">
                    {isLoading && <CgSpinner size={20} className="animate-spin" />}
                    <p>{isLoading ? "Please wait..." : "Confirm"}</p>
                </button>
            </section>
            <RegistrationModal modalData={modalData} modalCallback={modalCallback} />
        </form>
    );
}