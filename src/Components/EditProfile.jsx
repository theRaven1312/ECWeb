const EditProfile = () => {
    return (
        <div
            className="absolute inset-0 bg-black/20 backdrop-blur-md
 flex items-center justify-center z-50 overflow-hidden"
        >
            <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">
                <h2 className="text-xl font-bold mb-4 font-sans">
                    CHANGE INFOMATION
                </h2>
                <form className="space-y-5 font-sans font-bold">
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        className="w-full p-2 rounded bg-gray-200"
                    />
                    <input
                        type="text"
                        name="phone"
                        placeholder="Phone number"
                        className="w-full p-2 rounded bg-gray-200"
                    />
                    <input
                        type="text"
                        name="address"
                        placeholder="Address"
                        className="w-full p-2 rounded bg-gray-200"
                    />
                    <div className="flex justify-end gap-3 pt-3">
                        <button
                            type="button"
                            className="px-4 py-2 bg-gray-200 rounded hover:bg-red-500 hover:text-white cursor-pointer"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-gray-200 rounded hover:bg-black hover:text-white cursor-pointer"
                        >
                            Lưu
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfile;
