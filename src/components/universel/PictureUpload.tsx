"use client";
import Image from "next/image";
import { useRef } from "react";
import { FieldError, UseFormClearErrors, UseFormSetError, UseFormSetValue } from "react-hook-form";
import { RegistrationBoxInputType } from "@/types/gettedUserDataType";
import { BsCloudUpload } from "react-icons/bs";

interface PictureUploadType extends React.HTMLProps<HTMLInputElement> {
    alt: string;
    containerClassName?: string;
    currentImage?: string;
    previousImage?: string;
    onChange: (...event: any[]) => void;
    maxSize: number;
    error?: FieldError
    clearError: UseFormClearErrors<RegistrationBoxInputType>
    setError: UseFormSetError<RegistrationBoxInputType>
}

export default function PictureUpload({ alt, containerClassName, currentImage, previousImage, onChange, maxSize, error, clearError, setError, ...rest }: PictureUploadType) {

    const pictureInputRef = useRef<HTMLInputElement | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > maxSize) return setError("image", { message: "Image can't be larger than 3MB" });
            const reader = new FileReader();
            reader.onload = (event) => {
                clearError("image")
                onChange(event.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    }

    return (
        <div className={containerClassName}>
            {currentImage ? (
                <Image 
                    src={currentImage} 
                    alt={alt} 
                    height={80} 
                    width={80} 
                    className="rounded-full lg:mx-auto object-cover object-center w-[80px] h-[80px]" 
                />
            ) : previousImage ? (
                <Image 
                    src={previousImage} 
                    alt={alt}
                    height={80} 
                    width={80} 
                    className="rounded-full lg:mx-auto object-cover object-center w-[80px] h-[80px]" 
                />
            ) : null}
            <button type="button" onClick={() => pictureInputRef.current?.click()} className="py-1 px-5 mx-auto outline-none bg-gray-200 shadow-md hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-gray-300 hover:text-black text-gray-800 rounded transition-all flex items-center justify-center space-x-2">
                <p>{(currentImage || previousImage) ? "Change" : "Upload"}</p>
                <BsCloudUpload size={20} />
            </button>
            {error && <p className="text-xs text-red-500">{error.message}</p>}
            <input type="file" name={alt} ref={pictureInputRef} onChange={handleFileChange} accept="image/*" hidden {...rest} />
        </div>
    );
}
