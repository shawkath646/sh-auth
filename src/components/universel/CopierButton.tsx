"use client";
import { ButtonHTMLAttributes } from "react";
import { LuClipboard } from "react-icons/lu";

export default function CopierButton({ text, ...rest }: { text: string } & ButtonHTMLAttributes<HTMLButtonElement>) {

    async function copyToClipboard() {
        try {
            await navigator.clipboard.writeText(text);
            alert('Text copied to clipboard!');
        } catch (error) {
            console.error('Failed to copy:', error);
        }
    }

    return (
        <button type="button" onClick={copyToClipboard} {...rest} >
            <LuClipboard size={15} />
        </button>
    );
}