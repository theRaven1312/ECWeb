export const ProfileInfo = ({heading, data}) => {
    return (
        <div className="profile-info ">
            <h1 className="text-xl font-bold">{heading}</h1>
            <p
                className={
                    data
                        ? "text-lg break-words bg-gray-200 p-2 rounded-md select-none opacity-70 text-gray-600"
                        : "h-10 bg-gray-200 p-2 rounded-md opacity-70"
                }
            >
                {data}
            </p>
        </div>
    );
};
