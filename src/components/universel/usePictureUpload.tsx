import { useRef } from "react";
import { FieldError, UseFormClearErrors, UseFormSetError } from "react-hook-form";

export interface PictureUploadProps {
    name: string;
    onChange: (value: string) => void;
    maxSize: number;
    clearErrors: UseFormClearErrors<any>;
    setError: UseFormSetError<any>;
}

export function usePictureUpload({ name, onChange, maxSize, clearErrors, setError }: PictureUploadProps) {
    const pictureInputRef = useRef<HTMLInputElement | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > maxSize) return setError(name, { message: "Image can't be larger than 3MB" });
            const reader = new FileReader();
            reader.onload = (event) => {
                clearErrors(name)
                onChange(event.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const openFilePicker = () => {
        pictureInputRef.current?.click();
    };

    return {
        pictureInputRef,
        handleFileChange,
        openFilePicker,
    };
}
