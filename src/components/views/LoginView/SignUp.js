import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import validator from "validator";
import { PhoneInput } from "react-international-phone";
import { PhoneNumberUtil } from "google-libphonenumber";
import "react-international-phone/style.css";
import "./style.css";

export default function SignUp() {
  let navigate = useNavigate();
  const [disabled, setDisabled] = useState(false);
  const [validated, setValidated] = useState(false);
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    contactNumber: "",
    email_format: false,
    passwordCheck: false,
    passwordMatch: false,
  });
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    repeatPassword: "",
    contactNumber: "",
    otp: "",
  });

  const [otpData, setOtpData] = useState({
    otp: "",
    otpVerified: false,
    otpSent: false,
    numAttempts: 0,
  });

  const phoneUtil = PhoneNumberUtil.getInstance();

  const isPhoneValid = (contactNumber) => {
    try {
      return phoneUtil.isValidNumber(
        phoneUtil.parseAndKeepRawInput(contactNumber)
      );
    } catch (error) {
      return false;
    }
  };

  const emailValid = (e) => {
    let email = e.target.value;
    if (validator.isEmail(email) && email.endsWith("mail.utoronto.ca")) {
      setData({ ...data, email: email, email_format: true });
      setErrors({ ...data, email: "" });
      setDisabled(false);
    } else {
      setErrors({ ...data, email: "Please enter a valid UofT email." });
      setData({ ...data, email_format: false });
      setOtpData({ ...otpData, otpSent: false });
      setDisabled(true);
    }
  };

  const updatePassword = (e) => {
    const password = e.target.value;
    let pwd = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,24}$/;
    if (!pwd.test(password)) {
      setErrors({
        ...errors,
        password:
          "Password must contain one digit from 1 to 9, one lowercase letter, one uppercase letter, one special character, no space, and it must be 8-16 characters long ",
      });
      setData({ ...data, passwordCheck: false });
      setDisabled(true);
    } else {
      setData({ ...data, password: password });
      setData({ ...data, passwordCheck: true });
      setErrors({ ...errors, password: "" });
      setDisabled(false);
    }
  };

  const confirmpassword = (e) => {
    const repeatPassword = e.target.value;
    if (repeatPassword != data.password) {
      setErrors({
        ...errors,
        repeatPassword: "Both the passwords do not match.",
      });
      setData({ ...data, passwordMatch: false });
      setDisabled(true);
    } else {
      setErrors({
        ...errors,
        repeatPassword: "",
      });
      setData({ ...data, passwordMatch: true });
      setDisabled(false);
    }
  };

  const sendOtp = async (event) => {
    event.preventDefault();
    var controller = new AbortController();
    const signal = controller.signal;
    const jsonData = {
      email: data.email,
    };
    return fetch("http://localhost:3000/user/sendOTP", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jsonData),
      signal: signal,
    })
      .then((response) => {
        if (response.status === 200) {
          return response.text().then((msg) => {
            console.log(msg);
            setOtpData({ ...otpData, otpSent: true });
          });
        } else {
          // Handle other status codes
          return response.text().then((errorMessage) => {
            alert(`Error: ${errorMessage}`);
            controller.abort();
          });
        }
      })
      .catch((err) => {
        console.log(err);
        setDisabled(true);
        setValidated(false);
      });
  };

  const resendOtp = async (event) => {
    if (otpData.numAttempts < 5) {
      sendOtp(event);
      otpData.numAttempts = otpData.numAttempts + 1;
    } else {
      setErrors({
        ...errors,
        otp: "Sorry, you've already had atleast 5 attempts. Please try again after 1 hour",
      });
    }
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    var controller = new AbortController();
    const signal = controller.signal;
    setDisabled(true);
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setDisabled(false);
    } else {
      const jsonData = {
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        contactNumber: data.contactNumber,
        OTP: otpData.otp,
      };
      return fetch("http://localhost:3000/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jsonData),
        signal: signal,
      })
        .then((response) => {
          if (response.status === 200) {
            return response.json().then((json) => {
              console.log(json);
              setDisabled(false);
              setValidated(true);
              setOtpData({ ...otpData, otpVerified: true });
              navigate("/login", { replace: true });
            });
          } else {
            // Handle other status codes
            return response.text().then((errorMessage) => {
              alert(`Error: ${errorMessage}`);
              controller.abort();
            });
          }
        })
        .catch((err) => {
          console.log(err);
          setDisabled(true);
          setValidated(false);
        });
    }
  };

  return (
    <div className="auth-wrapper container h-40">
      <div className="row d-flex justify-content-center align-items-center h-100">
        <div className="col-12 col-md-9 col-lg-7 col-xl-6">
          <div className="card rounded-3">
            <div className="card-body p-4">
              <div className="auth-inner">
                <form onSubmit={submitHandler}>
                  <h3>Sign Up</h3>

                  <div className="mb-3">
                    <label>First name</label>
                    <input
                      required
                      type="text"
                      className="form-control"
                      placeholder="First name"
                      onChange={(e) =>
                        setData({ ...data, firstName: e.target.value })
                      }
                    />
                  </div>

                  <div className="mb-3">
                    <label>Last name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Last name"
                      required
                      onChange={(e) =>
                        setData({ ...data, lastName: e.target.value })
                      }
                    />
                  </div>

                  <div className="mb-3">
                    <label>Email address</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Enter email"
                      required
                      onChange={(e) => emailValid(e)}
                    />
                    {data.email_format == false && (
                      <span style={{ fontSize: 15, color: "red" }}>
                        {errors.email}{" "}
                      </span>
                    )}

                    {data.email_format ? (
                      <div>
                        <input
                          type="button"
                          value="Verify"
                          onClick={(e) => sendOtp(e)}
                          style={{
                            backgroundColor: "blue",
                            width: "100%",
                            padding: 8,
                            color: "white",
                            border: "none",
                          }}
                        />
                      </div>
                    ) : null}
                  </div>

                  {otpData.otpSent ? (
                    <div className="mb-3">
                      <label>One Time Password</label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Enter OPT sent to your email"
                      />
                      <input
                        type="button"
                        value="Resend OTP"
                        onChange={(e) => resendOtp(e)}
                        style={{
                          backgroundColor: "blue",
                          marginLeft: 25,
                          width: "25%",
                          padding: 8,
                          color: "white",
                          border: "none",
                        }}
                      />
                    </div>
                  ) : null}

                  <div className="mb-3">
                    <label>Password</label>
                    <input
                      required
                      type="password"
                      className="form-control"
                      placeholder="Enter password"
                      onChange={(e) => updatePassword(e)}
                    />
                    {data.passwordCheck == false && (
                      <span style={{ fontSize: 15, color: "red" }}>
                        {errors.password}{" "}
                      </span>
                    )}
                  </div>

                  <div className="mb-3">
                    <label>Repeat Password</label>
                    <input
                      required
                      type="password"
                      className="form-control"
                      placeholder="Enter password"
                      onChange={(e) => confirmpassword(e)}
                    />
                    {!data.passwordMatch && (
                      <span style={{ fontSize: 15, color: "red" }}>
                        {errors.repeatPassword}{" "}
                      </span>
                    )}
                  </div>

                  <div className="mb-3">
                    <label>Contact Information</label>
                    <div>
                      <PhoneInput
                        required
                        defaultCountry="ca"
                        onChange={(phone) => setData({ ...data, phone: phone })}
                      />

                      {!isPhoneValid(data.phone) && (
                        <div style={{ color: "red" }}>
                          {errors.contactNumber}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={disabled}
                    >
                      Sign Up
                    </button>
                  </div>
                  <span className="forgot-password text-right">
                    Already registered? <a href="/login">sign in</a>
                  </span>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
