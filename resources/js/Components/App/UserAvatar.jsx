const UserAvatar = ({ user, online = null, profile = false }) => {
    const sizeClass = profile ? "w-40 h-40" : "w-8 h-8";
    const dotSize = profile ? "w-4 h-4" : "w-2.5 h-2.5";
    const dotColor =
        online === true
            ? "bg-green-500"
            : online === false
            ? "bg-gray-400"
            : "hidden";

    return (
        <div className={`relative avatar ${sizeClass}`}>
            <div className={`rounded-full overflow-hidden w-full h-full`}>
                {user.avatar_url ? (
                    <img
                        src={user.avatar_url}
                        alt={user.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="bg-gray-400 text-gray-800 flex items-center justify-center w-full h-full">
                        <span className="text-xl font-bold">
                            {user.name[0]}
                        </span>
                    </div>
                )}
            </div>

            {/* Status dot */}
            <span
                className={`absolute top-0 right-0 rounded-full ring-2 ring-white ${dotSize} ${dotColor}`}
            ></span>
        </div>
    );
};
export default UserAvatar;
