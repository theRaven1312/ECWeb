import {useState} from "react";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;
import {useNavigate} from "react-router-dom";

const LoginPage = () => {
    const navigate = useNavigate();
    let [isActive, setIsActive] = useState(null);

    const handleAddClass = () => setIsActive(true);
    const handleRemoveClass = () => setIsActive(false);

    const [visible, setVisible] = useState(false);
    const handleVisible = () => setVisible((prev) => !prev);

    //Kết nối API đăng nhập với backend
    const [logInEmail, setLogInEmail] = useState("");
    const [logInPassword, setLogInPassword] = useState("");
    const [status, setStatus] = useState("");
    const [message, setMessage] = useState("");

    const handleLogInSumbit = (e) => {
        e.preventDefault();
        axios
            .post(`${apiUrl}/users/log-in`, {
                email: logInEmail,
                password: logInPassword,
            })
            .then((res) => {
                if (res.data.status === "OK") {
                    navigate("/");
                } else {
                    setStatus(res.data.status);
                    setMessage(res.data.message);
                }
            })
            .catch((err) => console.log(err));
    };

    //Kết nối API đăng nhập với backend
    const [registerName, setRegisterName] = useState("");
    const [registerEmail, setRegisterEmail] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");

    const handleRegisterSumbit = (e) => {
        e.preventDefault();
        axios
            .post(`${apiUrl}/users/sign-in`, {
                name: registerName,
                email: registerEmail,
                password: registerPassword,
            })
            .then((res) => {
                if (res.data.status === "OK") {
                    navigate("/");
                }
            })
            .catch((err) => console.log(err));
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
                                    status === "ERROR" ? "shake" : ""
                                }`}
                                type="text"
                                placeholder="Username"
                                name="name"
                                required
                                onChange={(e) => {
                                    setLogInEmail(e.target.value);
                                    setStatus("");
                                }}
                            />
                            <i
                                class={`fa-solid fa-user ${
                                    status === "ERROR" ? "shake" : ""
                                }`}
                            ></i>
                        </div>

                        <div className="login-form__input">
                            <input
                                className={`${
                                    status === "ERROR" ? "shake" : ""
                                }`}
                                type={visible ? "text" : "password"}
                                placeholder="Password"
                                name="password"
                                required
                                onChange={(e) => {
                                    setLogInPassword(e.target.value);
                                    setStatus("");
                                }}
                            />
                            <i
                                className={`fa-solid ${
                                    visible ? "fa-eye-slash" : "fa-eye"
                                } cursor-pointer ${
                                    status === "ERROR" ? "shake" : ""
                                }`}
                                onClick={handleVisible}
                            ></i>
                        </div>

                        {status === "ERROR" && (
                            <span className="text-base text-red-600 font-sans font-bold flex-start">
                                {message}
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

                        <div className="login-form__input">
                            <input
                                type="text"
                                placeholder="Username"
                                name="name"
                                required
                                onChange={(e) =>
                                    setRegisterName(e.target.value)
                                }
                            />
                            <i className="fa-solid fa-user"></i>
                        </div>

                        <div className="login-form__input">
                            <input
                                type="text"
                                placeholder="Email"
                                name="email"
                                required
                                onChange={(e) =>
                                    setRegisterEmail(e.target.value)
                                }
                            />
                            <i class="fa-solid fa-envelope"></i>
                        </div>

                        <div className="login-form__input">
                            <input
                                type={visible ? "text" : "password"}
                                placeholder="Password"
                                required
                                name="password"
                                onChange={(e) =>
                                    setRegisterPassword(e.target.value)
                                }
                            />
                            <i
                                className={`fa-solid ${
                                    visible ? "fa-eye-slash" : "fa-eye"
                                } cursor-pointer`}
                                onClick={handleVisible}
                            ></i>
                        </div>

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
