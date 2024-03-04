import React from "react";
import Image from "next/image";
import { FieldError } from "react-hook-form";
import { BsCloudUpload } from "react-icons/bs";
import { usePictureUpload, PictureUploadProps } from "./usePictureUpload";

interface PictureUploadType extends PictureUploadProps {
    alt: string;
    name: string;
    containerClassName?: string;
    currentImage?: string;
    previousImage?: string;
    error?: FieldError;
    imageSize: number;
}

export default function PictureUpload({
    alt,
    name,
    imageSize,
    containerClassName,
    currentImage,
    previousImage,
    error,
    onChange,
    clearErrors,
    setError,
    maxSize,
}: PictureUploadType) {
    const { pictureInputRef, handleFileChange, openFilePicker } = usePictureUpload({
        name,
        onChange,
        maxSize,
        clearErrors,
        setError
    });

    return (
        <div className={containerClassName}>
            {currentImage ? (
                <Image
                    src={currentImage}
                    alt={alt}
                    height={imageSize}
                    width={imageSize}
                    className="rounded-full lg:mx-auto object-cover object-center"
                    style={{ height: imageSize, width: imageSize }}
                />
            ) : previousImage && (
                <Image
                    src={previousImage}
                    alt={alt}
                    height={imageSize}
                    width={imageSize}
                    className="rounded-full lg:mx-auto object-cover object-center"
                    style={{ height: imageSize, width: imageSize }}
                />
            )}
            <button
                type="button"
                onClick={openFilePicker}
                className="py-1 px-5 mx-auto outline-none bg-gray-200 shadow-md hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-gray-300 hover:text-black text-gray-800 rounded transition-all flex items-center justify-center space-x-2"
            >
                <p>{(currentImage || previousImage) ? "Change" : "Upload"}</p>
                <BsCloudUpload size={20} />
            </button>
            {error && <p className="text-xs text-red-500">{error.message}</p>}
            <input type="file" name={name} ref={pictureInputRef} onChange={handleFileChange} accept="image/*" hidden />
        </div>
    );
}
