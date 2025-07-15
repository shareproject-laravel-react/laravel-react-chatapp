import { usePage } from "@inertiajs/react";
import ReactMarkdown from "react-markdown";
import React from "react";
import UserAvatar from "./UserAvatar";
import { formatMessageDateLong } from "@/helpers";
import MessageAttachments from "./MessageAttachments";
import MessageOptionsDropdown from "./MessageOptionsDropdown";

const MessageItem = ({ message, attachmentClick }) => {
    const currentUser = usePage().props.auth.user;
    const isOwnMessage = message.sender_id === currentUser.id;

    return (
        <div className={`chat ${isOwnMessage ? "chat-end" : "chat-start"}`}>
            <UserAvatar user={message.sender} />

            <div className="chat-header">
                {!isOwnMessage && message.sender.name}
                <time className="text-xs opacity-50 ml-2">
                    {formatMessageDateLong(message.created_at)}
                </time>
            </div>

            <div
                className={`chat-bubble relative  backdrop-blur-md text-white shadow-md rounded-2xl ${
                    isOwnMessage ? "bg-pink-300/70" : "bg-pink-500/70"
                } `}
            >
                {message.sender_id == currentUser.id && (
                    <MessageOptionsDropdown message={message} />
                )}
                <div className="chat-message">
                    <div className="chat-message-content markdown">
                        <ReactMarkdown>{message.message}</ReactMarkdown>
                    </div>
                    <MessageAttachments
                        attachments={message.attachments}
                        attachmentClick={attachmentClick}
                    />
                </div>
            </div>
        </div>
    );
};

export default MessageItem;
