import { useEventBus } from "@/EventBus";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

export default function Toast() {
    const { on } = useEventBus();
    const [toasts, setToasts] = useState([]);

    useEffect(() => {
        const showToast = (message) => {
            const uuid = uuidv4();
            setToasts((oldToasts) => [...oldToasts, { message, uuid }]);
            setTimeout(() => {
                setToasts((oldToasts) =>
                    oldToasts.filter((toast) => toast.uuid !== uuid)
                );
            }, 5000);
        };

        on("toast.show", showToast);
    }, [on]);

    return (
        <div className="fixed top-4 right-4 z-50 space-y-3 min-w-[240px]">
            {toasts.map((toast) => (
                <div
                    key={toast.uuid}
                    className="relative px-5 py-4 rounded-xl shadow-lg text-sm text-pink-100 border border-pink-300 backdrop-blur-lg bg-pink-500/20 transition-all duration-500 animate-fade-in"
                >
                    <div className="font-medium text-white">
                        You have a message:
                    </div>
                    <div className="mt-1 text-pink-100 italic">
                        {toast.message}
                    </div>
                </div>
            ))}
        </div>
    );
}
