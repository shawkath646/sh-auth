import { ImSpinner8 } from "react-icons/im";

export default function LoadingSpinner() {
    return (
        <main className="min-h-screen w-full bg-white dark:bg-black text-black dark:text-gray-200">
            <div className="h-screen container mx-auto flex justify-center items-center">
                <section className="space-y-2">
                    <ImSpinner8 size={40} className="animate-spin mx-auto" />
                    <p className="text-center text-lg font-medium">Please wait...</p>
                </section>
            </div>
        </main>
    );
}