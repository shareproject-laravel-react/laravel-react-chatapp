import { EllipsisVerticalIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { useEventBus } from "@/EventBus";

export default function MessageOptionsDropdown({ message }) {
    const { emit } = useEventBus();
    const onMessageDelete = () => {
        console.log("delete message");
        axios
            .delete(route("message.destroy", message.id))
            .then((res) => {
                console.log(res.data);

                emit("message.deleted", {
                    message,
                    prevMessage: res.data.message,
                });
            })
            .catch((err) => {
                console.error(err);
            });
    };

    return (
        <div className="absolute right-full text-gray-100 top-1/2 -translate-1/2 z-10">
            <Menu>
                <Menu.Button className="flex justify-center items-center w-8 h-8 rounded-full hover:bg-black/40">
                    <EllipsisVerticalIcon className="h-5 w-5" />
                </Menu.Button>
                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                    <Menu.Items className="absolute left-0 mt-2 w-48 rounded-md bg-gray-800 shadow-lg z-50">
                        <div className="px-1 py-1">
                            <Menu.Item>
                                {({ active }) => (
                                    <button
                                        onClick={onMessageDelete}
                                        className={`${
                                            active
                                                ? "bg-black/30 text-white"
                                                : "text-gray-100"
                                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                    >
                                        <TrashIcon className="w-4 h-4 mr-2" />
                                        Delete
                                    </button>
                                )}
                            </Menu.Item>
                        </div>
                    </Menu.Items>
                </Transition>
            </Menu>
        </div>
    );
}
