"use client";
import { Fragment, useState } from "react";
import { Controller, SubmitHandler, useForm, FieldError } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Transition } from "@headlessui/react";
import { Listbox } from "@headlessui/react";
import RedirectUrlBox from "@/app/auth/profile/applications/create-new/RedirectUrlBox";
import PictureUpload from "@/components/universel/PictureUpload";
import ReactDatePicker from "react-datepicker";
import registerApp from "@/actions/database/profile/registerApp";
import registerAppSchema from "@/Schema/registerAppSchema";
import toTitleCase from "@/utils/toTitleCase";
import { PartialAppDataType } from "@/types/types";
import { CgPlayListAdd, CgSpinner } from "react-icons/cg";
import { PiCaretUpDownBold } from "react-icons/pi";
import "react-datepicker/dist/react-datepicker.css";

export default function CreateNewBox() {

    const [isAccepted, setAccepted] = useState(false);

    const { control, register, handleSubmit, watch, clearErrors, setError, formState: { errors, isSubmitting } } = useForm<PartialAppDataType>({
        resolver: yupResolver(registerAppSchema),
        defaultValues: {
            redirectUrl: []
        }
    });

    const { status: inactiveSelected } = watch();

    const onSubmit: SubmitHandler<PartialAppDataType> = async (data) => {
        await registerApp(data);
    }

    const applicationType = ["Web application", "Android application", "IOS application", "Desktop applicatoin"];
    const applicationStatus = ["Active", "Inactive"];

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-10 2xl:flex justify-between space-y-10">
            <section className="space-y-3 max-w-[850px]">
                <Controller
                    name="appIcon"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                        <PictureUpload
                            alt="Register app icon"
                            name="appIcon"
                            currentImage={field.value}
                            onChange={field.onChange}
                            error={errors.appIcon}
                            clearErrors={clearErrors}
                            setError={setError}
                            maxSize={3000000}
                            imageSize={40}
                            containerClassName="flex items-center justify-center space-x-3 mb-5 w-[200px] mx-auto"
                        />
                    )}
                />
                <div className="grid lg:grid-cols-2 gap-4">
                    <div className="mx-auto w-[350px] md:w-[400px] lg:mx-0">
                        <label className="block uppercase font-medium text-gray-600 dark:text-gray-400 text-sm">Application name</label>
                        <input type="text" autoFocus placeholder="" {...register("appName")} aria-invalid={errors.appName ? "true" : "false"} className="bg-gray-200 dark:bg-gray-800 outline-none border border-gray-400 aria-invalid:border-red-500 dark:border-gray-700 rounded py-1.5 px-2 mt-1 focus:border-blue-500 w-full transition-all text-sm" />
                        {errors.appName && <p className="text-xs text-red-500 mt-1">{errors.appName.message}</p>}
                    </div>

                    <div className="mx-auto w-[350px] md:w-[400px] lg:mx-0">
                        <label className="block uppercase font-medium text-gray-600 dark:text-gray-400 text-sm">Application type</label>
                        <Controller
                            name="appType"
                            control={control}
                            defaultValue=""
                            render={({ field: { onChange, value } }) => (
                                <Listbox value={value} onChange={onChange}>
                                    <div className="relative">
                                        <Listbox.Button className="mt-1 text-left text-sm bg-gray-200 dark:bg-gray-800 text-black dark:text-gray-200 w-full py-1.5 px-2 rounded flex justify-between items-center hover:bg-gray-400 dark:hover:bg-gray-900 transition-all">
                                            <p>{toTitleCase(value || "Select Type")}</p>
                                            <PiCaretUpDownBold size={16} />
                                        </Listbox.Button>
                                        <Transition
                                            as={Fragment}
                                            leave="transition ease-in duration-100"
                                            leaveFrom="opacity-100"
                                            leaveTo="opacity-0"
                                        >
                                            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-gray-800 py-1 text-base shadow-lg sm:text-sm z-10">
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
                </div>
                <div className="grid lg:grid-cols-2 gap-4">
                    <div className="mx-auto w-[350px] md:w-[400px] lg:mx-0">
                        <label className="block uppercase font-medium text-gray-600 dark:text-gray-400 text-sm">Description <span className="font-normal text-xs">(Optional)</span></label>
                        <textarea placeholder="" {...register("description")} aria-invalid={errors.description ? "true" : "false"} className="bg-gray-200 dark:bg-gray-800 outline-none border border-gray-400 dark:border-gray-700 aria-invalid:border-red-500 rounded py-1.5 px-2 mt-1 focus:border-blue-500 w-full transition-all disabled:text-gray-400 dark:disabled:text-gray-500 text-sm resize-none h-[103px]" />
                        {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>}
                    </div>
                    <div className="space-y-3">
                        <div className="mx-auto w-[350px] md:w-[400px] lg:mx-0">
                            <label className="block uppercase font-medium text-gray-600 dark:text-gray-400 text-sm">Application version</label>
                            <input type="text" placeholder="" {...register("version")} aria-invalid={errors.version ? "true" : "false"} className="bg-gray-200 dark:bg-gray-800 outline-none border border-gray-400 dark:border-gray-700 aria-invalid:border-red-500 rounded py-1.5 px-2 mt-1 focus:border-blue-500 w-full transition-all text-sm" />
                            {errors.version && <p className="text-xs text-red-500 mt-1">{errors.version.message}</p>}
                        </div>
                        <div className="mx-auto w-[350px] md:w-[400px] lg:mx-0">
                            <label className="block uppercase font-medium text-gray-600 dark:text-gray-400 text-sm">Application status</label>
                            <Controller
                                name="status"
                                control={control}
                                defaultValue=""
                                render={({ field: { onChange, value } }) => (
                                    <Listbox value={value} onChange={onChange}>
                                        <div className="relative">
                                            <Listbox.Button className="mt-1 text-left text-sm bg-gray-200 dark:bg-gray-800 text-black dark:text-gray-200 w-full py-1.5 px-2 rounded flex justify-between items-center hover:bg-gray-400 dark:hover:bg-gray-900 transition-all">
                                                <p>{toTitleCase(value || "Select Status")}</p>
                                                <PiCaretUpDownBold size={16} />
                                            </Listbox.Button>
                                            <Transition
                                                as={Fragment}
                                                leave="transition ease-in duration-100"
                                                leaveFrom="opacity-100"
                                                leaveTo="opacity-0"
                                            >
                                                <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-gray-800 py-1 text-base shadow-lg sm:text-sm">
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
                    </div>
                </div>
                {inactiveSelected === "inactive" && (
                    <div className="grid lg:grid-cols-2 gap-4">
                        <div className="mx-auto w-[350px] md:w-[400px] lg:mx-0">
                            <label className="block uppercase font-medium text-gray-600 dark:text-gray-400 text-sm">Inactive message</label>
                            <input type="text" placeholder="" {...register("inactiveMessage")} aria-invalid={errors.inactiveMessage ? "true" : "false"} className="bg-gray-200 dark:bg-gray-800 outline-none border border-gray-400 dark:border-gray-700 aria-invalid:border-red-500 rounded py-1.5 px-2 mt-1 focus:border-blue-500 w-full transition-all text-sm" />
                            {errors.inactiveMessage && <p className="text-xs text-red-500 mt-1">{errors.inactiveMessage.message}</p>}
                        </div>
                        <div className="mx-auto w-[350px] md:w-[400px] lg:mx-0">
                            <label className="block uppercase font-medium text-gray-600 dark:text-gray-400 text-sm">Inactive until</label>
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
                                            className="bg-gray-200 dark:bg-gray-800 outline-none border border-gray-400 dark:border-gray-700 aria-invalid:border-red-500 rounded py-1.5 px-2 mt-1 focus:border-blue-500 w-full transition-all text-sm"
                                        />
                                    </div>
                                )}
                            />
                            {errors.inactiveUntil && <p className="text-xs text-red-500 mt-1">{errors.inactiveUntil.message}</p>}
                        </div>
                    </div>
                )}
                <div className="grid lg:grid-cols-2 gap-4">
                    <div className="mx-auto w-[350px] md:w-[400px] lg:mx-0">
                        <label className="block uppercase font-medium text-gray-600 dark:text-gray-400 text-sm">Page Alert Message</label>
                        <input type="text" placeholder="" {...register("pageAlertMessage")} aria-invalid={errors.pageAlertAction ? "true" : "false"} className="bg-gray-200 dark:bg-gray-800 outline-none border border-gray-400 dark:border-gray-700 aria-invalid:border-red-500 rounded py-1.5 px-2 mt-1 focus:border-blue-500 w-full transition-all text-sm" />
                        {errors.pageAlertMessage && <p className="text-xs text-red-500 mt-1">{errors.pageAlertMessage.message}</p>}
                    </div>
                    <div className="mx-auto w-[350px] md:w-[400px] lg:mx-0">
                        <label className="block uppercase font-medium text-gray-600 dark:text-gray-400 text-sm">Page Alert Action</label>
                        <input type="text" placeholder="" {...register("pageAlertAction")} aria-invalid={errors.pageAlertAction ? "true" : "false"} className="bg-gray-200 dark:bg-gray-800 outline-none border border-gray-400 dark:border-gray-700 aria-invalid:border-red-500 rounded py-1.5 px-2 mt-1 focus:border-blue-500 w-full transition-all text-sm" />
                        {errors.pageAlertAction && <p className="text-xs text-red-500 mt-1">{errors.pageAlertAction.message}</p>}
                    </div>
                </div>
                <div className="grid lg:grid-cols-2 gap-4">
                    <div className="mx-auto w-[350px] md:w-[400px] lg:mx-0">
                        <label className="block uppercase font-medium text-gray-600 dark:text-gray-400 text-sm">OAuth scope</label>
                        <input type="text" placeholder="" value="openid profile email" disabled className="bg-gray-200 dark:bg-gray-800 outline-none border border-gray-400 dark:border-gray-700 aria-invalid:border-red-500 rounded py-1.5 px-2 mt-1 focus:border-blue-500 w-full transition-all disabled:text-gray-400 dark:disabled:text-gray-500 text-sm" />
                    </div>
                    <div className="mx-auto w-[350px] md:w-[400px] lg:mx-0">
                        <label className="block uppercase font-medium text-gray-600 dark:text-gray-400 text-sm">Redirect url</label>
                        <Controller
                            name="redirectUrl"
                            control={control}
                            render={({ field }) => (
                                <RedirectUrlBox field={field} isEditMode={true} error={errors.redirectUrl as (FieldError | undefined)[]} />
                            )}
                        />
                    </div>
                </div>
                <div className="grid lg:grid-cols-2 gap-4">
                    <div className="mx-auto w-[350px] md:w-[400px] lg:mx-0">
                        <label className="block uppercase font-medium text-gray-600 dark:text-gray-400 text-sm">Contact email</label>
                        <input type="email" placeholder="" {...register("contact")} aria-invalid={errors.contact ? "true" : "false"} className="bg-gray-200 dark:bg-gray-800 outline-none border border-gray-400 dark:border-gray-700 aria-invalid:border-red-500 rounded py-1.5 px-2 mt-1 focus:border-blue-500 w-full transition-all text-sm" />
                        {errors.contact && <p className="text-xs text-red-500 mt-1">{errors.contact.message}</p>}
                    </div>
                    <div className="mx-auto w-[350px] md:w-[400px] lg:mx-0">
                        <label className="block uppercase font-medium text-gray-600 dark:text-gray-400 text-sm">Application website</label>
                        <input type="text" placeholder="" {...register("website")} aria-invalid={errors.website ? "true" : "false"} className="bg-gray-200 dark:bg-gray-800 outline-none border border-gray-400 dark:border-gray-700 aria-invalid:border-red-500 rounded py-1.5 px-2 mt-1 focus:border-blue-500 w-full transition-all text-sm" />
                        {errors.website && <p className="text-xs text-red-500 mt-1">{errors.website.message}</p>}
                    </div>
                </div>
                <div className="grid lg:grid-cols-2 gap-4">
                    <div className="mx-auto w-[350px] md:w-[400px] lg:mx-0">
                        <label className="block uppercase font-medium text-gray-600 dark:text-gray-400 text-sm">Privacy policy url</label>
                        <input type="text" placeholder="" {...register("privacyPolicy")} aria-invalid={errors.privacyPolicy ? "true" : "false"} className="bg-gray-200 dark:bg-gray-800 outline-none border border-gray-400 dark:border-gray-700 aria-invalid:border-red-500 rounded py-1.5 px-2 mt-1 focus:border-blue-500 w-full transition-all text-sm" />
                        {errors.privacyPolicy && <p className="text-xs text-red-500 mt-1">{errors.privacyPolicy.message}</p>}
                    </div>
                </div>
            </section>
            <section className="text-gray-500 2xl:w-[600px]">
                <h2 className="text-2xl font-bold mb-4">Terms & Conditions</h2>
                <ul className="list-disc pl-5 mb-6 text-sm">
                    <li className="mb-2">I will only use the provided API credentials for the intended purposes as described in my application.</li>
                    <li className="mb-2">I will not attempt to access or modify data beyond the scope of my user's permissions.</li>
                    <li className="mb-2">I understand that the provided API credentials are confidential and should not be shared with anyone else.</li>
                    <li className="mb-2">I will adhere to all applicable laws and regulations while using this application.</li>
                </ul>
                <p className="mb-4 text-sm">I also acknowledge that this application may be subject to suspension or revocation of API access if unusual or unauthorized activity is detected by the server. This includes but is not limited to:</p>
                <ul className="list-disc pl-5 mb-6 text-sm">
                    <li className="mb-2">Excessive API requests beyond normal usage patterns.</li>
                    <li className="mb-2">Unauthorized access attempts to restricted resources.</li>
                    <li className="mb-2">Violation of the terms of service or privacy policy of this website.</li>
                </ul>
                <p className="mb-4 text-sm">I understand that suspension or revocation of API access is at the discretion of the website administrators and may occur without prior notice.</p>
                <div className="flex items-center mb-4 text-sm">
                    <input type="checkbox" id="agree" checked={isAccepted} onChange={() => setAccepted(prev => !prev)} className="form-checkbox h-5 w-5 text-blue-500" />
                    <label htmlFor="agree" className="ml-2">I have read and agree to the above policies and rules.</label>
                </div>
                <div className="text-center lg:text-right w-full">
                    <button type="submit" disabled={isSubmitting || !isAccepted} className="w-full md:w-auto px-4 mx-auto md:mr-0 py-1.5 rounded bg-sky-800 mt-8 text-white dark:text-gray-200 hover:bg-blue-900 transition-all flex items-center justify-center space-x-2 disabled:bg-gray-500">
                        {isSubmitting ? <CgSpinner size={20} className="animate-spin" /> : <CgPlayListAdd size={20} />}
                        <p>{isSubmitting ? "Please wait..." : "Register"}</p>
                    </button>
                </div>
            </section>
        </form>
    );
}