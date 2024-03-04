"use client";
import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import deleteApp from "@/actions/database/profile/deleteApp";
import { MdOutlineDelete } from "react-icons/md";
import { CgSpinner } from "react-icons/cg";

export default function DeleteButton({ appId, appName, imageUrl }: { appId: string; appName: string; imageUrl: string; }) {

    const [isDialogOpen, setDialogOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setLoading] = useState(false);

    const handleDelete = async () => {
        setLoading(true);
        await deleteApp(appId, imageUrl);
    }

    return (
        <>
            <button type="button" onClick={() => setDialogOpen(true)} className="block px-6 py-1.5 border border-red-500 rounded text-red-500 hover:text-white dark:hover:text-gray-200 hover:bg-red-500 transition-all align-middle ml-auto">Delete</button>
            <Transition show={isDialogOpen}>
                <Dialog as="div" className="relative z-10" onClose={() => { }}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/50" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-red-500">Delete {appName}?</Dialog.Title>
                                    <p className="text-sm text-gray-400 mt-2 font-medium"> To confirm the deletion of <span className="font-bold">{appName}</span>, please write down the app name below:</p>
                                    <input type="text" value={inputValue} onChange={event => setInputValue(event.target.value)} className="outline-none mt-3 px-2 py-1.5 rounded bg-gray-200 dark:bg-gray-700" />

                                    <div className="flex items-center justify-end space-x-2 mt-4">
                                        <button type="button" disabled={isLoading} onClick={() => setDialogOpen(false)} className="py-1.5 px-4 text-sm font-medium bg-gray-700 hover:bg-gray-900 text-white dark:text-gray-200 rounded-md disabled:bg-gray-500">Cancel</button>
                                        <button
                                            type="button"
                                            disabled={(appName !== inputValue) || isLoading}
                                            className="justify-center rounded-md border border-transparent bg-red-100 px-4 py-1.5 text-sm font-medium text-red-500 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:bg-gray-500 disabled:text-gray-200 flex items-center space-x-2"
                                            onClick={handleDelete}
                                        >
                                            {isLoading ? (
                                                <CgSpinner size={18} className="animate-spin" />
                                            ) : (
                                                <MdOutlineDelete size={18} />
                                            )}
                                            <p>{isLoading ? "Please wait..." : "Delete"}</p>
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
}