import { UsersIcon } from "@heroicons/react/24/outline";

const GroupAvatar = () => {
    return (
        <div className="w-8 h-8 rounded-full bg-gray-400 text-gray-800 flex items-center justify-center">
            <UsersIcon className="w-4 h-4" />
        </div>
    );
};

export default GroupAvatar;
