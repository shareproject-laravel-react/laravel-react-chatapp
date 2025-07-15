import { Link, usePage } from "@inertiajs/react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import UserAvatar from "./UserAvatar";
import GroupAvatar from "./GroupAvatar";

const ConversationHeader = ({ selectedConversation }) => {
    return (
        <>
            {selectedConversation && (
                <div className="p-3 flex justify-between items-center border-b border-slate-700">
                    <div>
                        <Link
                            href={route("dashboard")}
                            className="inline-block sm:hidden"
                        >
                            <ArrowLeftIcon className="w-6" />
                        </Link>
                        {selectedConversation.is_user && (
                            <div className="flex items-center gap-3">
                                <UserAvatar user={selectedConversation} />
                                <h3 className="font-semibold">
                                    {selectedConversation.name}
                                </h3>
                            </div>
                        )}
                        {selectedConversation.is_group && (
                            <div className="flex items-center gap-3">
                                <GroupAvatar user={selectedConversation} />
                                <div>
                                    <h3 className="font-semibold">
                                        {selectedConversation.name}
                                    </h3>
                                    <p className="text-xs text-gray-500">
                                        {selectedConversation.users.length}{" "}
                                        Members
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default ConversationHeader;
