"use client";
import { Fragment, useRef, useState } from "react";
import { Controller, SubmitHandler, useForm, FieldError } from "react-hook-form";
import { Listbox, Transition } from "@headlessui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import TextareaAutosize from 'react-textarea-autosize';
import ReactDatePicker from "react-datepicker";
import RedirectUrlBox from "@/app/auth/profile/applications/manage/[...slug]/RedirectUrlBox";
import PictureUpload from "@/components/universel/PictureUpload";
import registerAppSchema from "@/Schema/registerAppSchema";
import updateApp from "@/actions/database/profile/updateApp";
import refreshAuthSecret from "@/actions/database/profile/refreshAuthSecret";
import toTitleCase from "@/utils/toTitleCase";
import formatDate from "@/utils/formatDate";
import { AppDataType, PartialAppDataType, StatusType } from "@/types/types";
import { BiReset } from "react-icons/bi";
import { CiEdit } from "react-icons/ci";
import { FiClipboard } from "react-icons/fi";
import { MdOutlineEditOff } from "react-icons/md";
import { PiCaretUpDownBold } from "react-icons/pi";
import { CgSpinner } from "react-icons/cg";
import "react-datepicker/dist/react-datepicker.css";
import CopierButton from "@/components/universel/CopierButton";




export default function ManageBox({ appData }: { appData: AppDataType }) {

    const [isEditMode, setEditMode] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState<StatusType>({
        status: "success",
        message: ""
    });

    const authSecretRef = useRef<HTMLParagraphElement | null>(null);

    const { appName, appIcon, appType, contact, description, inactiveMessage, privacyPolicy, website, status, version, redirectUrl, inactiveUntil, pageAlertAction, pageAlertMessage } = appData;

    const defaultValues: PartialAppDataType = {
        appName,
        appIcon,
        appType,
        contact,
        description,
        inactiveMessage,
        privacyPolicy,
        website,
        status,
        version,
        redirectUrl,
        inactiveUntil, 
        pageAlertAction,
        pageAlertMessage
    };

    const { control, register, handleSubmit, clearErrors, reset, setError, formState: { errors } } = useForm<PartialAppDataType>({
        resolver: yupResolver(registerAppSchema),
        defaultValues
    });


    const applicationType = ["Web application", "Android application", "IOS application", "Desktop applicatoin"];
    const applicationStatus = ["Active", "Inactive"];

    const onSubmit: SubmitHandler<PartialAppDataType> = async (data) => {
        setLoading(true);

        const newObject: Partial<AppDataType> = Object.keys(data).reduce((acc, key) => {
            const appDataValue = appData[key as keyof AppDataType];
            const dataValue = data[key as keyof PartialAppDataType];

            if (Array.isArray(appDataValue) && Array.isArray(dataValue)) {
                if (JSON.stringify(appDataValue) !== JSON.stringify(dataValue)) {
                    return { ...acc, [key]: dataValue };
                }
            } else {
                if (appDataValue !== dataValue) {
                    return { ...acc, [key]: dataValue };
                }
            }

            return acc;
        }, {} as Partial<AppDataType>);

        if (Object.keys(newObject).length === 0) {
            setStatusMessage({
                status: "error",
                message: "No changes have been made to update"
            });
            setLoading(false);
            return;
        }

        const response = await updateApp(newObject, appData.appIcon);
        setStatusMessage(response);
        setEditMode(false);
        setLoading(false);
    }

    const handleSecretReset = async () => {
        if (authSecretRef.current) {
            authSecretRef.current.innerText = "Loading...";
            const newSecret = await refreshAuthSecret(appData.id);
            authSecretRef.current.innerText = newSecret;
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex items-center justify-between mb-3">
                <p className="text-lg md:text-xl lg:text-2xl text-emerald-500">Application Information</p>
                <button type="button" onClick={() => setEditMode(prev => !prev)} className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 transition-all text-white dark:text-gray-200 py-1.5 px-1.5 lg:px-3 rounded text-sm md:text-base">
                    {isEditMode ? (
                        <MdOutlineEditOff size={18} />
                    ) : (
                        <CiEdit size={18} />
                    )}
                    <p>{isEditMode ? "Disable Edit" : "Enable Edit"}</p>
                </button>
            </div>
            {isEditMode && (
                <p className="w-full py-2 text-sm bg-emerald-500 bg-opacity-20 text-emerald-500 text-center rounded">Edit mode enabled!</p>
            )}
            <div className="grid lg:grid-cols-2 gap-x-20 gap-y-8 text-sm mt-8">
                <section className="space-y-5">
                    <div className="space-y-2">
                        <label className="font-medium text-emerald-500 block">App ID</label>
                        <div className="flex items-center space-x-2">
                            <p className={isEditMode ? "text-gray-500" : ""}>{appData.id}</p>
                            <CopierButton text={appData.id} className="dark:text-gray-400 dark:hover:text-gray-600 transition-all" />
                        </div>
                    </div>
                    <div className="space-y-2 max-w-[200px]">
                        <label className="font-medium text-emerald-500 block">App Icon</label>
                        <Controller
                            control={control}
                            name="appIcon"
                            render={({ field }) => (
                                <PictureUpload
                                    name="appIcon"
                                    alt={`${appData.appName} icon`}
                                    currentImage={field.value}
                                    onChange={field.onChange}
                                    error={errors.appIcon}
                                    clearErrors={clearErrors}
                                    setError={setError}
                                    maxSize={3000000}
                                    imageSize={50}
                                    containerClassName="flex items-center justify-start space-x-3"
                                />
                            )}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="font-medium text-emerald-500 block">App Name</label>
                        <input {...register("appName")} readOnly={!isEditMode} className="outline-none bg-transparent w-full" />
                        {errors.appName && <p className="text-xs text-red-500">{errors.appName.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <label className="font-medium text-emerald-500 block text-sm">App Description</label>
                        <TextareaAutosize {...register("description")} readOnly={!isEditMode} placeholder="Write a description..." className="text-sm bg-transparent outline-none resize-none scrollbar-hide rounded w-[350px] md:w-[480px] lg:w-full" />
                        {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <label className="font-medium text-emerald-500 block">App Type</label>
                        <Controller
                            name="appType"
                            control={control}
                            defaultValue=""
                            render={({ field: { onChange, value } }) => (
                                <Listbox value={value} onChange={onChange}>
                                    <div className="relative">
                                        <Listbox.Button aria-disabled={!isEditMode} className="text-left text-sm bg-gray-200 dark:bg-gray-800 text-black dark:text-gray-200 w-[180px] py-1.5 px-2 rounded flex justify-between items-center aria-disabled:bg-transparent hover:bg-gray-400 dark:hover:bg-gray-900 transition-all">
                                            <p>{toTitleCase(value || "Select Type")}</p>
                                            {isEditMode && (
                                                <PiCaretUpDownBold size={16} />
                                            )}
                                        </Listbox.Button>
                                        <Transition
                                            as={Fragment}
                                            leave="divansition ease-in duration-100"
                                            leaveFrom="opacity-100"
                                            leaveTo="opacity-0"
                                        >
                                            <Listbox.Options className="absolute mt-1 max-h-60 w-[250px] overflow-auto rounded-md bg-white dark:bg-gray-800 py-1 text-base shadow-lg sm:text-sm z-10">
                                                {applicationType.map((name, index) => (
                                                    <Listbox.Option key={index} value={name.toLowerCase()} className={({ active }) => `
                                                            cursor-pointer select-none py-2 pl-5 ${active ? "bg-blue-500 bg-opacity-20 text-blue-500" : ""}
                                                        `}>{name}</Listbox.Option>
                                                ))}
                                            </Listbox.Options>
                                        </Transition>
                                        {errors.appType && <p className="text-xs text-red-500 mt-1">{errors.appType.message}</p>}
                                    </div>
                                </Listbox>
                            )}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="font-medium text-emerald-500 block">App Version</label>
                        <input {...register("version")} readOnly={!isEditMode} className="outline-none bg-transparent w-full" />
                        {errors.version && <p className="text-xs text-red-500">{errors.version.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <label className="font-medium text-emerald-500 block">Author ID</label>
                        <p className={isEditMode ? "text-gray-500" : ""}>{appData.author}</p>
                    </div>
                    <div className="space-y-2">
                        <label className="font-medium text-emerald-500 block">Created On</label>
                        <p className={isEditMode ? "text-gray-500" : ""}>{formatDate(appData.createdOn as Date)}</p>
                    </div>
                    <div className="space-y-2">
                        <label className="font-medium text-emerald-500 block">Application Website / repository</label>
                        <input type="text" {...register("website")} className="bg-transparent outline-none w-full" />
                        {errors.website && <p className="text-xs text-red-500">{errors.website.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <label className="font-medium text-emerald-500 block">Contact Mail</label>
                        <input type="email" {...register("contact")} className="bg-transparent outline-none w-full" />
                        {errors.contact && <p className="text-xs text-red-500">{errors.contact.message}</p>}
                    </div>
                </section>
                <section className="space-y-5">
                    <div className="space-y-2">
                        <label className="font-medium text-emerald-500 block">App Status</label>
                        <Controller
                            name="status"
                            control={control}
                            defaultValue=""
                            render={({ field: { onChange, value } }) => (
                                <Listbox value={value} onChange={onChange}>
                                    <div className="relative">
                                        <Listbox.Button aria-disabled={!isEditMode || appData.status === "suspended"} className="text-left text-sm bg-gray-200 dark:bg-gray-800 text-black dark:text-gray-200 w-[180px] py-1.5 px-2 rounded flex justify-between items-center aria-disabled:bg-transparent hover:bg-gray-400 dark:hover:bg-gray-900 transition-all">
                                            <p>{toTitleCase(value || "Select Status")}</p>
                                            {isEditMode && (
                                                <PiCaretUpDownBold size={16} />
                                            )}
                                        </Listbox.Button>
                                        <Transition
                                            as={Fragment}
                                            leave="divansition ease-in duration-100"
                                            leaveFrom="opacity-100"
                                            leaveTo="opacity-0"
                                        >
                                            <Listbox.Options className="absolute mt-1 max-h-60 w-[250px] overflow-auto rounded-md bg-white dark:bg-gray-800 py-1 text-base shadow-lg sm:text-sm">
                                                {applicationStatus.map((name, index) => (
                                                    <Listbox.Option key={index} value={name.toLowerCase()} className={({ active }) => `
                                                            cursor-pointer select-none py-2 pl-5 ${active ? "bg-blue-500 bg-opacity-20 text-blue-500" : ""}
                                                        `}>{name}</Listbox.Option>
                                                ))}
                                            </Listbox.Options>
                                        </Transition>
                                        {errors.status && <p className="text-xs text-red-500 mt-1">{errors.status.message}</p>}
                                    </div>
                                </Listbox>
                            )}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="font-medium text-emerald-500 block">Inactive Message</label>
                        <TextareaAutosize {...register("inactiveMessage")} readOnly={!isEditMode} placeholder="Write inactive message..." className="outline-none bg-transparent w-full resize-none" />
                        {errors.inactiveMessage && <p className="text-xs text-red-500">{errors.inactiveMessage.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <label className="font-medium text-emerald-500 block">Inactive Until</label>
                        <Controller
                            name="inactiveUntil"
                            control={control}
                            render={({ field }) => (
                                <div className="customDatePickerWidth">
                                    <ReactDatePicker
                                        selected={field.value}
                                        onChange={field.onChange}
                                        dateFormat="yyyy-MM-dd"
                                        placeholderText="yyyy-MM-dd"
                                        className="block bg-transparent py-2 px-2 outline-none text-sm transition-all"
                                    />
                                    {errors.inactiveUntil && <p className="text-xs text-red-500">{errors.inactiveUntil.message}</p>}
                                </div>
                            )}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="font-medium text-emerald-500 block">Page Alert Message</label>
                        <TextareaAutosize {...register("pageAlertMessage")} readOnly={!isEditMode} placeholder="Write page alert message..." className="outline-none bg-transparent w-full resize-none" />
                        {errors.pageAlertMessage && <p className="text-xs text-red-500">{errors.pageAlertMessage.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <label className="font-medium text-emerald-500 block">Page Alert Action</label>
                        <TextareaAutosize {...register("pageAlertAction")} readOnly={!isEditMode} placeholder="Write page alert action..." className="outline-none bg-transparent w-full resize-none" />
                        {errors.pageAlertAction && <p className="text-xs text-red-500">{errors.pageAlertAction.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <label className="font-medium text-emerald-500 block">App Secret</label>
                        <div className="flex items-center space-x-2 w-[350px] md:w-[480px] lg:w-full">
                            <p ref={authSecretRef} className={`truncate ${isEditMode ? "text-gray-500" : ""}`}>{appData.appSecret ? appData.appSecret.slice(0, 10) + "*".repeat(appData.appSecret.length - 10) : "null"}</p>
                            <CopierButton text={appData.appSecret} className="dark:text-gray-400 dark:hover:text-gray-600 transition-all" />
                            <button type="button" onClick={handleSecretReset} className="text-left text-sm bg-gray-200 dark:bg-gray-800 text-black dark:text-gray-200 py-1.5 px-3 rounded aria-disabled:bg-transparent hover:bg-gray-400 dark:hover:bg-gray-900 transition-all">Refresh</button>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="font-medium text-emerald-500 block">OAuth Scope</label>
                        <p className={isEditMode ? "text-gray-500" : ""}>{appData.scope.join(" ")}</p>
                    </div>
                    <div>
                        <label className="font-medium text-emerald-500 block">Redirect URL</label>
                        <div className="py-3 space-y-2">
                            <Controller
                                name="redirectUrl"
                                control={control}
                                render={({ field }) => (
                                    <RedirectUrlBox field={field} isEditMode={isEditMode} error={errors.redirectUrl as (FieldError | undefined)[]} />
                                )}
                            />
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <label className="font-medium text-emerald-500 block">Privacy Policy URL</label>
                        <input type="text" {...register("privacyPolicy")} className="bg-transparent outline-none w-full" />
                        {errors.privacyPolicy && <p className="text-xs text-red-500">{errors.privacyPolicy.message}</p>}
                    </div>
                </section>
            </div>
            {statusMessage.message && (
                <p className={`${statusMessage.status === "error" ? "bg-red-500/20 text-red-500" : "bg-green-500/20 text-green-500"} text-sm font-medium max-w-[400px] mx-auto py-1.5 text-center rounded mt-5`}>{statusMessage.message}</p>
            )}
            <div className="flex items-center justify-end mt-8 space-x-3">
                <button type="button" disabled={isLoading} onClick={() => reset()} className="px-3 py-1 lg:py-1.5 text-white dark:text-gray-200 bg-blue-600 hover:bg-blue-700 transition-all rounded flex items-center justify-center space-x-2 disabled:bg-gray-500">
                    <BiReset size={18} />
                    <p>Reset</p>
                </button>
                <button type="submit" disabled={isLoading} className="px-3 py-1 lg:py-1.5 text-white dark:text-gray-200 bg-violet-600 hover:bg-violet-700 rounded flex items-center justify-center space-x-2 disabled:bg-gray-500 transition-all">
                    {isLoading && <CgSpinner size={18} className="animate-spin" />}
                    <p>{isLoading ? "Please wait..." : "Update"}</p>
                </button>
            </div>
        </form>
    );
}