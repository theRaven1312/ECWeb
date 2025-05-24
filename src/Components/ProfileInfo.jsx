export const ProfileInfo = ({heading, data}) => {
    return (
        <div className="profile-info ">
            <h1 className="profile-info__heading text-xl font-bold">
                {heading}
            </h1>
            <p className="profile-info__data text-lg break-words bg-gray-200 p-2 rounded-md select-none opacity-70 text-gray-600">
                {data}
            </p>
        </div>
    );
};
