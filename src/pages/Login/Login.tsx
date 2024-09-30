import React, { useState } from "react";
import "./Login.css";
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Login: React.FC = () => {
  const [action, setAction] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [, setLoginDisabled] = useState(true);
  const [, setRegisterDisabled] = useState(true);
  const navigate = useNavigate();
  const { login } = useAuth();

  const registerLink = () => {
    setAction(" active");
  };

  const loginLink = () => {
    setAction("");
  };

  // Function to handle username input change
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    updateButtonStates();
  };

  // Function to handle email input change and validate format
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    updateButtonStates();
  };

  // Function to handle password input change and validate strength
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    updateButtonStates();
  };

  // Function to handle terms agreement checkbox change
  const handleAgreeTermsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAgreeTerms(e.target.checked);
    updateButtonStates();
  };

  // Function to update login and register button disabled state based on input validity
  const updateButtonStates = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const strongPasswordRegex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

    // Login button state
    if (username.trim() !== "" && password.trim() !== "") {
      setLoginDisabled(false);
    } else {
      setLoginDisabled(true);
    }

    // Register button state
    if (
      username.trim() !== "" &&
      emailRegex.test(email) &&
      strongPasswordRegex.test(password) &&
      agreeTerms
    ) {
      setRegisterDisabled(false);
    } else {
      setRegisterDisabled(true);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/login/`,
        {
          username,
          password,
        }
      );
      const userData = response.data; // Assuming API response includes user data
      login(userData); // Store user data in context
      console.log(userData);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  const handleSignup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/signup/`,
        {
          username,
          password,
          email,
        }
      );
      console.log("User created successfully:", response.data);
      navigate("/login#");
      loginLink();
      // Automatically login after successful registration (optional)
    } catch (error) {
      console.error("Error signing up:", error);
    }
  };

  return (
    <div className="login-page">
      <div className={`wrapper ${action}`}>
        <div className="form-box login">
          <form onSubmit={handleSubmit}>
            <h1>Login</h1>
            <div className="input-box">
              <input
                type="text"
                placeholder="Username"
                required
                value={username}
                onChange={handleUsernameChange}
              />
              <FaUser className="icon" />
            </div>
            <div className="input-box">
              <input
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={handlePasswordChange}
                className={
                  !isPasswordStrongForLogin(password) ? "weak-password" : ""
                }
              />
              <FaLock className="icon" />
            </div>
            <div className="remember-forgot">
              <label>
                <input type="checkbox" />
                Remember me
              </label>
              <a href="#">Forgot Password?</a>
            </div>
            <button type="submit">Login</button>
            <div className="register-link">
              <p>
                Don't have an account?{" "}
                <a href="#" onClick={registerLink}>
                  Register
                </a>
              </p>
            </div>
          </form>
        </div>
        <div className="form-box register">
          <form onSubmit={handleSignup}>
            <h1>Registration</h1>
            <div className="input-box">
              <input
                type="text"
                placeholder="Username"
                required
                value={username}
                onChange={handleUsernameChange}
              />
              <FaUser className="icon" />
            </div>
            <div className="input-box">
              <input
                type="email"
                placeholder="Email"
                required
                value={email}
                onChange={handleEmailChange}
              />
              <FaEnvelope className="icon" />
            </div>
            <div className="input-box">
              <input
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={handlePasswordChange}
              />
              <FaLock className="icon" />
            </div>
            <div className="remember-forgot">
              <label>
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={handleAgreeTermsChange}
                />
                I agree to the terms & conditions
              </label>
            </div>
            <button type="submit">
              Register
            </button>
            <div className="register-link">
              <p>
                Already have an account?{" "}
                <a href="#" onClick={loginLink}>
                  Login
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

// Function to check if password meets strong criteria for login
const isPasswordStrongForLogin = (pass: string) => {
  const strongPasswordRegex =
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
  return strongPasswordRegex.test(pass);
};
