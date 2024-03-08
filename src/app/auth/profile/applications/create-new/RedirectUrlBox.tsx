"use client";
import { Fragment, useRef } from "react";
import { ControllerRenderProps, FieldError } from "react-hook-form";
import { PartialAppDataType } from "@/types/types";
import { RxCross2 } from "react-icons/rx";

export default function RedirectUrlBox({
    field,
    isEditMode,
    error
}: {
    field: ControllerRenderProps<PartialAppDataType, "redirectUrl">;
    isEditMode?: boolean;
    error?: (FieldError | undefined)[]
}) {

    const redirectUrlRef = useRef<HTMLInputElement | null>(null);

    const handleSetValue = () => {
        if (redirectUrlRef.current) {
            const currentValue = redirectUrlRef.current.value;
            if (!currentValue || field.value.includes(currentValue)) return;
            field.onChange([...field.value, currentValue]);
            redirectUrlRef.current.value = "";
        }
    }


    return (
        <>
            {field.value.map((url: string, index: number) => (
                <Fragment key={index}>
                    <div aria-invalid={error && error[index] ? "true" : "false"} className="bg-gray-200 dark:bg-gray-800 aria-invalid:border aria-invalid:border-red-500 rounded py-1 px-3 flex items-center justify-between space-x-3 w-[350px] md:w-[480px] lg:w-full">
                        <p className="truncate">{url}</p>
                        {isEditMode && (
                            <button
                                type="button"
                                onClick={() => field.onChange(field.value.filter(item => item !== url))}
                                className="hover:text-gray-500 transition-all"
                            >
                                <RxCross2 size={20} />
                            </button>
                        )}
                    </div>
                    {error && error[index] && <p key={`error-${index}`} className="text-xs text-red-500">{error[index]?.message}</p>}
                </Fragment>
            ))}
            {isEditMode && (
                <div className="space-y-2 w-[350px] md:w-full">
                    <input
                        type="text"
                        ref={redirectUrlRef}
                        className="bg-gray-200 dark:bg-gray-800 outline-none border border-gray-400 aria-invalid:border-red-500 dark:border-gray-700 rounded py-1.5 px-2 mt-1 focus:border-blue-500 w-full transition-all text-sm"
                    />
                    <button
                        type="button"
                        onClick={handleSetValue}
                        className="text-left text-sm bg-gray-200 dark:bg-gray-800 text-black dark:text-gray-200 py-1.5 px-6 rounded aria-disabled:bg-transparent hover:bg-gray-400 dark:hover:bg-gray-900 transition-all ml-auto block w-[80px]"
                    >
                        Add
                    </button>
                </div>
            )}
        </>
    );
}