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
        if (decode.exp < currentTime.getTime() / 1000) {
            const newData = await axios.post("/api/v1/users/refresh-token", {
                withCredentials: true,
            });

            localStorage.setItem("access_token", newData.data.accessToken);

            config.headers[
                "Authorization"
            ] = `Bearer ${newData.data.accessToken}`;
        } else {
            config.headers["Authorization"] = `Bearer ${storageData}`;
        }
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

export default axiosJWT;
