import { forwardRef } from "react";
import { InputBoxType } from "@/types/types";

const InputBox = forwardRef<HTMLInputElement, InputBoxType>(({ label, error, className, ...rest }, ref) => {
    return (
        <div className={className}>
            <label className="text-sm font-bold text-gray-500 dark:text-gray-400">{label}</label>
            <input
                {...rest}
                ref={ref}
                aria-invalid={error ? true : false}
                className="block py-2 px-2 rounded-lg outline-none border text-sm bg-gray-100 dark:bg-gray-700 aria-invalid:border-red-500 border-gray-200 dark:border-gray-700 focus:border-violet-600 read-only:text-gray-400 dark:text-gray-300 transition-all w-full"
            />
            {error && <p className="text-xs text-red-500">{error.message}</p>}
        </div>
    );
});

export default InputBox;
