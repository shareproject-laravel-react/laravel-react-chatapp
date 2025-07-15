import { useEventBus } from "@/EventBus"; // Add this at the top
import { useState, Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import {
    PaperClipIcon,
    PhotoIcon,
    FaceSmileIcon,
    HeartIcon,
    PaperAirplaneIcon,
    XCircleIcon,
} from "@heroicons/react/24/outline";
import NewMessageInput from "./NewMessageInput";
import EmojiPicker from "emoji-picker-react";
import AttachmentPreview from "./AttachmentPreview";
import { isImage, isAudio, isPDF, isPreviewable, isVideo } from "@/helpers";
import CustomAudioPlayer from "./CustomAudioPlayer";
import AudioRecorder from "./AudioRecorder";

const MessageInput = ({ conversation = null }) => {
    const { emit } = useEventBus();
    const [newMessage, setNewMessage] = useState("");
    const [inputErrorMessage, setInputErrorMessage] = useState("");
    const [messageSending, setMessageSending] = useState(false);
    //Message Attachment States
    const [chosenFiles, setChosenFiles] = useState([]);
    const [uploadProgress, setUploadProgress] = useState(0);

    //Heart Button sends a heart emoji, doesn't erase message text.
    const onLikeClick = () => {
        if (messageSending) {
            return;
        }
        const data = {
            message: "💗",
        };
        if (conversation.is_user) {
            data["receiver_id"] = conversation.id;
        } else if (conversation?.is_group) {
            data["group_id"] = conversation.id;
        }

        axios.post(route("message.store"), data);
    };

    //Message field text
    const onSendClick = () => {
        // emit("toast.show", "successful message");
        if (messageSending) {
            return;
        }
        if (newMessage.trim() === "" && chosenFiles.length === 0) {
            setInputErrorMessage("Message or attachment is required.");
            setTimeout(() => {
                setInputErrorMessage("");
            }, 3000);
            return;
        }

        const formData = new FormData();
        chosenFiles.forEach((file) => {
            formData.append("attachments[]", file.file);
        });
        formData.append("message", newMessage); // ✅ lowercase "message"

        if (conversation?.is_user) {
            formData.append("receiver_id", conversation.id);
        } else if (conversation?.is_group) {
            formData.append("group_id", conversation.id);
        } else {
            setInputErrorMessage("No valid conversation selected.");
            return;
        }

        // OPTIONAL: append attachments here if needed
        // files.forEach(file => formData.append("attachments[]", file));

        setMessageSending(true);

        axios
            .post(route("message.store"), formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round(
                        (progressEvent.loaded / progressEvent.total) * 100
                    );
                    console.log("Upload progress:", progress + "%");
                    setUploadProgress(progress);
                },
            })
            .then((response) => {
                // emit("message.created", response.data);
                setNewMessage("");
                setMessageSending(false);
                setUploadProgress(0);
                setChosenFiles([]);
            })
            .catch((error) => {
                setMessageSending(false);
                setChosenFiles([]);

                console.error("Caught error:", error);

                if (error.response) {
                    console.error("Backend response:", error.response);
                    const backendMsg = error.response?.data?.message;
                    setInputErrorMessage(
                        backendMsg || "Failed to send message."
                    );
                } else if (error.request) {
                    console.error(
                        "No response received. Request was:",
                        error.request
                    );
                    setInputErrorMessage("No response from server.");
                } else {
                    console.error(
                        "Something went wrong in setup:",
                        error.message
                    );
                    setInputErrorMessage(
                        "Something went wrong: " + error.message
                    );
                }
            });
    };
    const recordedAudioReady = (file, url) => {
        setChosenFiles((prevFiles) => {
            return [...prevFiles, { file, url }];
        });
    };
    //File Upload handler
    const onFileChange = (ev) => {
        const files = ev.target.files;
        const updatedFiles = [...files].map((file) => {
            return {
                file: file,
                url: URL.createObjectURL(file),
            };
        });
        ev.target.value = null;
        setChosenFiles((prevFiles) => {
            return [...prevFiles, ...updatedFiles];
        });
    };

    return (
        <div className="flex flex-wrap items-start border-t border-slate-700 py-3">
            <div className="order-2 flex-1 xs:flex-none xs:order-1 p-2">
                <button className="p-1 text-gray-400 hover:text-gray-300 relative">
                    <PaperClipIcon className="w-6" />
                    <input
                        type="file"
                        onChange={onFileChange}
                        multiple
                        className="absolute left-0 top-0 right-0 bottom-0 z-20 opacity-0 cursor-pointer"
                    />
                </button>
                <button className="p-1 text-gray-400 hover:text-gray-300 relative">
                    <PhotoIcon className="w-6" />
                    <input
                        type="file"
                        multiple
                        onChange={onFileChange}
                        accept="image/*"
                        className="absolute left-0 top-0 right-0 bottom-0 z-20 opacity-0 cursor-pointer"
                    />
                </button>
                <AudioRecorder fileReady={recordedAudioReady} />
            </div>
            <div className="order-1 px-3 xs:p-0 min-w-[220px] basis-full xs:basis-0 xs:order-2 flex-1 relative">
                <div className="flex items-center gap-2">
                    <div className="flex-1">
                        <NewMessageInput
                            value={newMessage}
                            onChange={(ev) => setNewMessage(ev.target.value)}
                            onSend={onSendClick}
                        />
                    </div>
                    <button
                        onClick={onSendClick}
                        className="btn btn-info min-h-[3rem] h-12 px-4"
                        disabled={messageSending}
                    >
                        <PaperAirplaneIcon className="w-6" />
                        <span className="hidden sm:inline">Send</span>
                    </button>
                </div>
                {""}
                {!!uploadProgress && (
                    <progress
                        className="progress progress-info w-full"
                        value={uploadProgress}
                        max="100"
                    ></progress>
                )}

                {inputErrorMessage && (
                    <p className="text-xs text-red-400">{inputErrorMessage}</p>
                )}
                <div className="flex flex-wrap gap-1 mt-2">
                    {chosenFiles.map((file) => {
                        return (
                            <>
                                {" "}
                                <div
                                    key={file.file.name}
                                    className={
                                        `relative flex justify-between cursor-pointer ` +
                                        (!isImage(file.file)
                                            ? " w-[240px]"
                                            : "")
                                    }
                                >
                                    {isImage(file.file) && (
                                        <img
                                            src={file.url}
                                            alt=""
                                            className="w-16 h-16 object-cover"
                                        />
                                    )}
                                    {isAudio(file.file) && (
                                        <CustomAudioPlayer
                                            file={file}
                                            showVolume={false}
                                        />
                                    )}
                                    {!isAudio(file.file) &&
                                        !isImage(file.file) && (
                                            <AttachmentPreview file={file} />
                                        )}
                                    <button
                                        onClick={() =>
                                            setChosenFiles(
                                                chosenFiles.filter(
                                                    (f) =>
                                                        f.file.name !==
                                                        file.file.name
                                                )
                                            )
                                        }
                                        className="absolute w-6 h-6 rounded-full bg-gray-800 -right-2 -top-2 text-gray-300 hover:text-gray-100 z-10"
                                    >
                                        <XCircleIcon className="w-6" />
                                    </button>
                                </div>{" "}
                            </>
                        );
                    })}
                </div>
            </div>

            <div className="order-3 xs:order-3 p-2 flex">
                <Popover className="relative">
                    <Popover.Button className="p-1 text-gray-400 hover:text-gray-300">
                        <FaceSmileIcon className="w-6 h-6" />
                    </Popover.Button>
                    <Popover.Panel className="absolute z-10 right-0 bottom-full">
                        <EmojiPicker
                            theme="dark"
                            onEmojiClick={(ev) =>
                                setNewMessage(newMessage + ev.emoji)
                            }
                        ></EmojiPicker>
                    </Popover.Panel>
                </Popover>
            </div>
            <div className="order-3 xs:order-3 p-2 flex">
                <button
                    onClick={onLikeClick}
                    className="p-1 text-gray-400 hover:text-gray-300"
                >
                    <HeartIcon className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
};
export default MessageInput;
