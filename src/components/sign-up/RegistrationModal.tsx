import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { RegistrationModalDataType } from "@/types/gettedUserDataType";
import { CgSpinner } from "react-icons/cg";

interface RegistrationModalType {
    modalData: RegistrationModalDataType;
    modalCallback: () => Promise<void>;
}

export default function RegistrationModal({ modalData, modalCallback }: RegistrationModalType) {

    const [isLoading, setLoading] = useState<boolean>(false);

    const handleCallback = async() =>  {
        setLoading(true);
        await modalCallback();
        if (modalData.success) return;
        setLoading(false);
    }

    return (
        <Transition appear show={modalData.isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-[60]" onClose={() => {}}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/25" />
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
                            <Dialog.Title
                                as="h3"
                                className={`text-lg font-medium leading-6 ${modalData.success ? "text-emerald-500" : "text-red-500"}`}
                            >
                                Server status: {modalData.code}
                            </Dialog.Title>
                            <p className="text-sm text-gray-500 dark:text-gray-300 mt-2">{modalData.message}</p>

                            <button
                                type="button"
                                className="rounded-md mt-4 bg-violet-500 text-white dark:text-gray-200 bg-opacity-60 px-4 py-2 text-sm font-medium dark:hover:bg-opacity-80 outline-none ml-auto flex justify-center items-center space-x-2 disabled:bg-gray-600"
                                onClick={handleCallback}
                                disabled={isLoading}
                            >
                                {modalData.success ? (
                                    isLoading ? (
                                        <>
                                            <p>Please wait...</p>
                                            <CgSpinner size={20} className="animate-spin" />
                                        </>
                                    ) : "Continue"
                                ) : (
                                    <p>Okay</p>
                                )}
                            </button>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}