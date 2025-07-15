import { useEventBus } from "@/EventBus";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import UserAvatar from "./UserAvatar";
import { Link } from "@inertiajs/react";

export default function NewMessageNotification() {
    const { on } = useEventBus();
    const [toasts, setToasts] = useState([]);

    useEffect(() => {
        on("newMessageNotification", ({ message, user, group_id }) => {
            const uuid = uuidv4();
            setToasts((oldToasts) => [
                ...oldToasts,
                { message, user, uuid, group_id },
            ]);
            setTimeout(() => {
                setToasts((oldToasts) =>
                    oldToasts.filter((toast) => toast.uuid !== uuid)
                );
            }, 2000);
        });
    }, [on]);

    return (
        <div className="fixed top-4 right-4 z-50 space-y-3 min-w-[240px]">
            {toasts.map((toast) => (
                <div
                    key={toast.uuid}
                    className="relative px-5 py-4 rounded-xl shadow-lg text-sm text-pink-100 border border-pink-300 backdrop-blur-lg bg-pink-500/20 transition-all duration-500 animate-fade-in"
                >
                    <Link
                        className="flex items-center gap-3"
                        href={
                            toast.group_id
                                ? route("chat.group", toast.group_id)
                                : route("chat.user", toast.user.id)
                        }
                    >
                        <UserAvatar user={toast.user} />
                        <div className="flex flex-col">
                            <span className="font-medium text-white">
                                New message from {toast.user.name}:
                            </span>
                            <span className="text-pink-100 italic">
                                {toast.message}
                            </span>
                        </div>
                    </Link>
                </div>
            ))}
        </div>
    );
}
