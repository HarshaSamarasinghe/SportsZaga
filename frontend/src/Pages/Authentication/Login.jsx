import "./Login.css";
import { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const containerRef = useRef(null);
  const navigate = useNavigate();

  const url = "http://localhost:4000";
  const [currentState, setCurrentState] = useState("Log In");

  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const onLogin = async (event) => {
    event.preventDefault();
    let newUrl = url;

    if (currentState === "Sign Up" && data.password !== data.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (currentState === "Log In") {
      newUrl += "/api/user/login";
    } else if (currentState === "Sign Up") {
      newUrl += "/api/user/register";
    }

    try {
      const response = await axios.post(newUrl, data);

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        console.log("Login successful", response.data);
        navigate("/profile");
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Login error:", error);
      alert(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    }
  };

  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginContainer" ref={containerRef}>
          <form className="loginPopup" onSubmit={onLogin}>
            <div className="loginPopupTitle">
              <h2>{currentState}</h2>
            </div>
            <button
              className="closeLoginButton"
              onClick={() =>
                window.history.length > 1 ? navigate(-1) : navigate("/")
              }
            >
              <i className="bx bx-x"></i>
            </button>

            <div className="loginInputs">
              {currentState === "Sign Up" && (
                <>
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    onChange={onChangeHandler}
                    value={data.name}
                  />
                </>
              )}

              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                required
                onChange={onChangeHandler}
                value={data.email}
              />

              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                id="password"
                required
                onChange={onChangeHandler}
                value={data.password}
              />

              {currentState === "Sign Up" && (
                <>
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    required
                    onChange={onChangeHandler}
                    value={data.confirmPassword}
                  />
                </>
              )}
            </div>

            <button className="authButton" type="submit">
              {currentState === "Sign Up" ? "Sign Up" : "Log In"}
            </button>

            <div className="horizontalLine"></div>

            <div className="changeLoginSignUpSection">
              {currentState === "Sign Up" ? (
                <p>
                  Already have an account?{" "}
                  <span
                    className="authChange"
                    onClick={() => {
                      setCurrentState("Log In");
                      setData({
                        name: "",
                        email: "",
                        password: "",
                        confirmPassword: "",
                      });
                    }}
                  >
                    Log in
                  </span>
                </p>
              ) : (
                <p>
                  Don't have an account?{" "}
                  <span
                    className="authChange"
                    onClick={() => {
                      setCurrentState("Sign Up");
                      setData({
                        name: "",
                        email: "",
                        password: "",
                        confirmPassword: "",
                      });
                    }}
                  >
                    Sign up
                  </span>
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
