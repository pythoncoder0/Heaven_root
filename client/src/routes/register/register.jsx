import "./register.scss";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import apiRequest from "../../lib/apiRequest";

function Register() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpMsg, setOtpMsg] = useState("");
  const [resendMsg, setResendMsg] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    const formData = new FormData(e.target);

    const username = formData.get("username");
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      await apiRequest.post("/auth/register", {
        username,
        email,
        password,
      });
      setRegisteredEmail(email);
      setShowOtp(true);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setOtpMsg("");
    setIsLoading(true);
    try {
      await apiRequest.post("/auth/verify-otp", {
        email: registeredEmail,
        otp,
      });
      setOtpMsg("Email verified! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setOtpMsg(err.response?.data?.message || "OTP verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResendMsg("");
    setIsLoading(true);
    try {
      await apiRequest.post("/auth/resend-otp", { email: registeredEmail });
      setResendMsg("OTP resent to your email.");
    } catch (err) {
      setResendMsg(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="registerPage">
      <div className="formContainer">
        {!showOtp ? (
          <form onSubmit={handleSubmit}>
            <h1>Create an Account</h1>
            <input name="username" type="text" placeholder="Username" required />
            <input name="email" type="email" placeholder="Email" required />
            <input name="password" type="password" placeholder="Password" required />
            <button disabled={isLoading}>Register</button>
            {error && <span>{error}</span>}
            <Link to="/login">Do you have an account?</Link>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit}>
          <h1>Verify Email</h1>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={e => setOtp(e.target.value)}
            required
          />
          <button className="btn" disabled={isLoading}>Verify OTP</button>
          <button
            type="button"
            className="btn"
            onClick={handleResendOtp}
            disabled={isLoading}
          >
            Resend OTP
          </button>
          {otpMsg && <span>{otpMsg}</span>}
          {resendMsg && <span>{resendMsg}</span>}
        </form>
        )}
      </div>
      <div className="imgContainer">
        <img src="/bg.png" alt="" />
      </div>
    </div>
  );
}

export default Register;
