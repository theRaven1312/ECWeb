import {useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import {useDispatch} from "react-redux";
import {updateUser} from "../redux/UserSlice.js";

const LoginPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    let [isActive, setIsActive] = useState(null);

    const handleAddClass = () => setIsActive(true);
    const handleRemoveClass = () => setIsActive(false);

    const [visible, setVisible] = useState(false);
    const handleVisible = () => setVisible((prev) => !prev);

    //Kết nối API đăng nhập với backend
    const [logInEmail, setLogInEmail] = useState("");
    const [logInPassword, setLogInPassword] = useState("");
    const [logInStatus, setLogInStatus] = useState("");
    const [logInMessage, setLogInMessage] = useState("");

    const handleLogInSumbit = (e) => {
        e.preventDefault();
        axios
            .post(`/api/v1/users/log-in`, {
                email: logInEmail,
                password: logInPassword,
            })
            .then((res) => {
                if (res.data.status === "OK") {
                    navigate("/");
                    const token = res.data.accessToken;
                    localStorage.setItem("access_token", token);

                    if (token) {
                        const decode = jwtDecode(token);
                        if (decode.id) {
                            axios
                                .get(`/api/v1/users/${decode.id}`, {
                                    headers: {
                                        Authorization: `Bearer ${token}`,
                                    },
                                })
                                .then((res) => {
                                    const user = res.data.data;
                                    dispatch(
                                        updateUser({
                                            ...user,
                                            access_token: token,
                                        })
                                    );
                                });
                        }
                    }
                } else {
                    setLogInStatus(res.data.status);
                    setLogInMessage(res.data.message);
                }
            })
            .catch((err) => console.log(err));
    };

    //Kết nối API đăng kí với backend
    const [registerName, setRegisterName] = useState("");
    const [registerEmail, setRegisterEmail] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");
    const [registerStatus, setRegisterStatus] = useState("");
    const [registerMessages, setRegisterMessages] = useState([]);

    const handleRegisterSumbit = (e) => {
        e.preventDefault();
        axios
            .post(`/api/v1/users/sign-in`, {
                name: registerName,
                email: registerEmail,
                password: registerPassword,
            })
            .then((res) => {
                if (res.data.status === "OK") {
                    handleRemoveClass();
                    setTimeout(() => {
                        setRegisterName("");
                        setRegisterEmail("");
                        setRegisterPassword("");
                    }, 600);
                }
            })
            .catch((err) => {
                if (err.response.data.status === "ERROR") {
                    setRegisterStatus("ERROR");
                    setRegisterMessages(
                        err.response.data.messages
                            ? err.response.data.messages
                            : [err.response.data.message]
                    );
                }
            });
    };

    return (
        <div className="login-page">
            <div className={`login-container ${isActive ? "active" : ""}`}>
                {/* Đăng nhập */}
                <div className="login-form form-box">
                    <form onSubmit={handleLogInSumbit}>
                        <h1 className="login-form__heading heading">Login</h1>

                        <div className="login-form__input">
                            <input
                                className={`${
                                    logInStatus === "ERROR" ? "shake" : ""
                                }`}
                                type="text"
                                placeholder="Email"
                                name="email"
                                value={logInEmail}
                                required
                                onChange={(e) => {
                                    setLogInEmail(e.target.value);
                                    setLogInStatus("");
                                }}
                            />
                            <i
                                class={`fa-solid fa-envelope ${
                                    logInStatus === "ERROR" ? "shake" : ""
                                }`}
                            ></i>
                        </div>

                        <div className="login-form__input">
                            <input
                                className={`${
                                    logInStatus === "ERROR" ? "shake" : ""
                                }`}
                                type={visible ? "text" : "password"}
                                placeholder="Password"
                                name="password"
                                value={logInPassword}
                                required
                                onChange={(e) => {
                                    setLogInPassword(e.target.value);
                                    setLogInStatus("");
                                }}
                            />
                            <i
                                className={`fa-solid ${
                                    visible ? "fa-eye-slash" : "fa-eye"
                                } cursor-pointer ${
                                    logInStatus === "ERROR" ? "shake" : ""
                                }`}
                                onClick={handleVisible}
                            ></i>
                        </div>

                        {logInStatus === "ERROR" && (
                            <span className="text-base text-red-600 font-sans font-bold">
                                {logInMessage}
                            </span>
                        )}

                        <div className="login-form__forgot-link">
                            <a href="#">Forgot password?</a>
                        </div>

                        <button type="submit" className="login-form__btn">
                            Login
                        </button>
                    </form>
                </div>

                {/* Đăng kí */}
                <div className="register-form form-box">
                    <form onSubmit={handleRegisterSumbit}>
                        <h1 className="login-form__heading heading">
                            Registration
                        </h1>

                        <div className="login-form__input ">
                            <input
                                className={`${
                                    registerStatus === "ERROR" ? "shake" : ""
                                }`}
                                type="text"
                                placeholder="Username"
                                name="name"
                                value={registerName}
                                required
                                onChange={(e) => {
                                    setRegisterName(e.target.value);
                                    setRegisterStatus("");
                                    setRegisterMessages([]);
                                }}
                            />
                            <i
                                class={`fa-solid fa-user ${
                                    registerStatus === "ERROR" ? "shake" : ""
                                }`}
                            ></i>
                        </div>

                        <div className="login-form__input">
                            <input
                                className={`${
                                    registerStatus === "ERROR" ? "shake" : ""
                                }`}
                                type="text"
                                placeholder="Email"
                                name="email"
                                value={registerEmail}
                                required
                                onChange={(e) => {
                                    setRegisterEmail(e.target.value);
                                    setRegisterStatus("");
                                    setRegisterMessages([]);
                                }}
                            />
                            <i
                                class={`fa-solid fa-envelope ${
                                    registerStatus === "ERROR" ? "shake" : ""
                                }`}
                            ></i>
                        </div>

                        <div className="login-form__input">
                            <input
                                className={`${
                                    registerStatus === "ERROR" ? "shake" : ""
                                }`}
                                type={visible ? "text" : "password"}
                                placeholder="Password"
                                required
                                name="password"
                                value={registerPassword}
                                onChange={(e) => {
                                    setRegisterPassword(e.target.value);
                                    setRegisterStatus("");
                                    setRegisterMessages([]);
                                }}
                            />
                            <i
                                className={`fa-solid ${
                                    visible ? "fa-eye-slash" : "fa-eye"
                                } cursor-pointer ${
                                    registerStatus === "ERROR" ? "shake" : ""
                                }`}
                                onClick={handleVisible}
                            ></i>
                        </div>

                        {registerStatus === "ERROR" && (
                            <div className="text-base text-red-600 font-sans font-bold">
                                {registerMessages.map((msg, index) => (
                                    <span key={index} className="block">
                                        {msg}
                                    </span>
                                ))}
                            </div>
                        )}

                        <button type="submit" className="login-form__btn">
                            Register
                        </button>
                    </form>
                </div>

                <div className="toggle-box">
                    <div className="toggle-container toggle-left">
                        <h1 className="heading text-white max-sm:text-2xl">
                            Welcome Back
                        </h1>
                        <p className="text-white">Don't have an account?</p>
                        <button
                            className="login-form__btn toggle-btn"
                            onClick={handleAddClass}
                        >
                            Register
                        </button>
                    </div>

                    <div className="toggle-container toggle-right">
                        <h1 className="heading text-white max-sm:text-xl max-xl:text-2xl">
                            Hello, Welcome
                        </h1>
                        <p className="text-white">Already have an account?</p>
                        <button
                            className="login-form__btn toggle-btn"
                            onClick={handleRemoveClass}
                        >
                            Login
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
