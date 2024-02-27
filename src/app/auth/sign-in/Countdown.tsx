import { useEffect, useState } from "react";
import { CgSpinner } from "react-icons/cg";

interface CountdownPropsType {
    handleResend: () => Promise<void>;
    time: Date;
}

export default function Countdown({ handleResend, time }: CountdownPropsType) {
    const [remainingTime, setRemainingTime] = useState<number>(time.getTime() - Date.now());
    const [completed, setCompleted] = useState<boolean>(false);
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        setRemainingTime(time.getTime() - Date.now());
        setCompleted(false);
    }, [time]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setRemainingTime(prevTime => {
                if (prevTime > 1000) {
                    return prevTime - 1000;
                } else {
                    clearInterval(intervalId);
                    setCompleted(true);
                    return 0;
                }
            });
        }, 1000);

        return () => clearInterval(intervalId);
    }, [time]);

    const totalSeconds = Math.floor(remainingTime / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    const handleResendClick = async () => {
        setLoading(true);
        await handleResend();
        setRemainingTime(time.getTime() - Date.now());
        setLoading(false);
        setCompleted(false);
    };

    if (completed) {
        return (
            <button type="button" disabled={isLoading} onClick={handleResendClick} className="text-sm py-1.5 px-3 outline-none bg-indigo-800 hover:bg-indigo-900 hover:text-gray-400 transition-all text-white dark:text-gray-200 disabled:bg-gray-500 rounded-lg font-medium flex items-center space-x-1">
                {isLoading && <CgSpinner size={20} className="animate-spin" />}
                <p>{isLoading ? "Sending..." : "Resend"}</p>
            </button>
        );
    }

    return (
        <div className="text-sm flex items-center justify-center space-x-1">
            <p className="w-[16px] tracking-wide">{String(minutes).padStart(2, '0')}</p>
            <p>:</p>
            <p className="w-[16px] tracking-wide">{String(seconds).padStart(2, '0')}</p>
        </div>
    );
}
