import {useState} from "react";

const LoginPage = () => {
    let [isActive, setIsActive] = useState(null);

    const handleAddClass = () => setIsActive(true);
    const handleRemoveClass = () => setIsActive(false);
    console.log(isActive);

    return (
        <div className="login-page">
            <div className={`login-container ${isActive ? "active" : ""}`}>
                <div className="login-form form-box">
                    <form action=" ">
                        <h1 className="login-form__heading heading">Login</h1>

                        <div className="login-form__input">
                            <input
                                type="text"
                                placeholder="Username"
                                required
                            />
                            <i class="fa-solid fa-user"></i>
                        </div>

                        <div className="login-form__input">
                            <input
                                type="password"
                                placeholder="Password"
                                required
                            />
                            <i class="fa-solid fa-lock"></i>
                        </div>

                        <div className="login-form__forgot-link">
                            <a href="#">Forgot password?</a>
                        </div>

                        <button type="submit" className="login-form__btn">
                            Login
                        </button>

                        <p>or login with other platform</p>

                        <div className="login-form__other">
                            <a href="#">
                                <i class="fa-brands fa-google"></i>
                            </a>

                            <a href="#">
                                <i class="fa-brands fa-facebook"></i>
                            </a>

                            <a href="#">
                                <i class="fa-brands fa-square-instagram"></i>
                            </a>

                            <a href="#">
                                <i class="fa-brands fa-square-x-twitter"></i>
                            </a>

                        </div>
                    </form>
                </div>

                <div className="register-form form-box">
                    <form action=" ">
                        <h1 className="login-form__heading heading">
                            Registration
                        </h1>

                        <div className="login-form__input">
                            <input
                                type="text"
                                placeholder="Username"
                                required
                            />
                            <i class="fa-solid fa-user"></i>
                        </div>

                        <div className="login-form__input">
                            <input type="text" placeholder="Email" required />
                            <i class="fa-solid fa-envelope"></i>
                        </div>

                        <div className="login-form__input">
                            <input
                                type="password"
                                placeholder="Password"
                                required
                            />
                            <i class="fa-solid fa-lock"></i>
                        </div>

                        <div className="login-form__forgot-link">
                            <a href="#">Forgot password?</a>
                        </div>

                        <button type="sumbit" className="login-form__btn">
                            Register
                        </button>

                        <p>or register with other platform</p>
                        <div className="login-form__other">
                            <a href="#">
                                <i class="fa-brands fa-google"></i>
                            </a>
                            <a href="#">
                                <i class="fa-brands fa-facebook"></i>
                            </a>
                            <a href="#">
                                <i class="fa-brands fa-square-instagram"></i>
                            </a>
                            <a href="#">
                                <i class="fa-brands fa-square-x-twitter"></i>
                            </a>
                        </div>
                        
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
