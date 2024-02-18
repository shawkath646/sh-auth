import { ImSpinner8 } from "react-icons/im";

export default function LoadingSpinner() {
    return (
        <section className="space-y-2">
            <ImSpinner8 size={40} className="animate-spin mx-auto" />
            <p className="text-center text-lg font-medium">Please wait...</p>
        </section>
    );
}