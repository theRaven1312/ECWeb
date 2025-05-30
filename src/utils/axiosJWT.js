import {jwtDecode} from "jwt-decode";
import axios from "axios";

const axiosJWT = axios.create();

const handleDecode = () => {
    const storageData = localStorage.getItem("access_token");
    let decode = {};
    if (storageData) {
        decode = jwtDecode(storageData);
    }
    return {storageData, decode};
};

axiosJWT.interceptors.request.use(
    async (config) => {
        const currentTime = new Date();
        const {decode, storageData} = handleDecode();

        if (decode.exp && decode.exp < currentTime.getTime() / 1000) {
            try {
                console.log("Token expired, refreshing...");
                const newData = await axios.post(
                    "/api/v1/users/refresh-token",
                    {
                        withCredentials: true,
                    }
                );

                // Lưu access token mới vào localStorage
                localStorage.setItem("access_token", newData.data.accessToken);

                config.headers[
                    "Authorization"
                ] = `Bearer ${newData.data.accessToken}`;
                console.log("Token refreshed successfully");
            } catch (error) {
                console.error("Refresh token failed:", error);
                // Nếu refresh token thất bại, xóa token cũ và chuyển hướng đến login
                localStorage.removeItem("access_token");
                window.location.href = "/login";
                return Promise.reject(error);
            }
        } else if (storageData) {
            config.headers["Authorization"] = `Bearer ${storageData}`;
        }
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

export default axiosJWT;
