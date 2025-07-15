import React, { useEffect, useRef } from "react";

const NewMessageInput = ({ value, onChange, onSend }) => {
    const input = useRef();

    const adjustHeight = () => {
        if (input.current) {
            input.current.style.height = "auto";
            input.current.style.height = input.current.scrollHeight + 1 + "px";
        }
    };

    useEffect(() => {
        adjustHeight();
    }, [value]);

    const onInputKeyDown = (ev) => {
        if (ev.key === "Enter" && !ev.shiftKey) {
            ev.preventDefault();
            onSend?.();
        }
    };

    const onChangeEvent = (ev) => {
        onChange(ev);
        setTimeout(() => {
            adjustHeight();
        }, 10);
    };

    return (
        <textarea
            ref={input}
            value={value}
            placeholder="Type a message..."
            onKeyDown={onInputKeyDown}
            onChange={onChangeEvent}
            className="textarea textarea-bordered w-full rounded-r-none resize-none overflow-y-auto max-h-40"
        ></textarea>
    );
};

export default NewMessageInput;
