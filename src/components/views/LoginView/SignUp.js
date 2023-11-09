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
  });
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    repeatPassword: "",
    contactNumber: "",
    otp: "",
    submit: "",
  });

  const [otpData, setOtpData] = useState({
    otp: "",
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
      console.log(error);
      return false;
    }
  };

  const emailValid = (e) => {
    let email = e.target.value;
    if (validator.isEmail(email) && email.endsWith("mail.utoronto.ca")) {
      setData({ ...data, email: email, email_format: true });
      setErrors({ ...errors, email: "" });
      setDisabled(false);
    } else {
      setErrors({ ...errors, email: "Please enter a valid UofT email." });
      setData({ ...data, email_format: false });
      setOtpData({ ...otpData, otpSent: false });
      setDisabled(true);
    }
  };

  const updatePassword = (e) => {
    const password = e.target.value;
    let regex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,24}$/;
    if (!regex.test(password)) {
      setErrors({
        ...errors,
        password:
          "Password must contain one digit from 1 to 9, one lowercase letter, one uppercase letter, one special character, no space, and it must be 8-16 characters long ",
      });
      setDisabled(true);
    } else {
      setData({ ...data, password });
      setErrors({ ...errors, password: "" });
      setDisabled(false);
    }
  };

  const confirmpassword = (e) => {
    const repeatPassword = e.target.value;
    if (repeatPassword !== data.password) {
      setErrors({
        ...errors,
        repeatPassword: "Both the passwords do not match.",
      });
      setDisabled(true);
    } else {
      setErrors({
        ...errors,
        repeatPassword: "",
      });
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
            setDisabled(false);
          });
        } else {
          // Handle other status codes
          return response.text().then((errorMessage) => {
            const errorObject = JSON.parse(errorMessage);
            setErrors({
              ...errors,
              otp: errorObject.message,
            });
            setOtpData({ ...otpData, otpSent: false });
            setDisabled(true);
            controller.abort();
          });
        }
      })
      .catch((err) => {
        const errorObject = JSON.parse(err);
        setErrors({
          ...errors,
          otp: errorObject.message,
        });
        setOtpData({ ...otpData, otpSent: false });
        setDisabled(true);
        setValidated(false);
      });
  };

  const resendOtp = async (event) => {
    console.log("reached resend");
    console.log(otpData.numAttempts);
    if (otpData.numAttempts < 5) {
      otpData.numAttempts = otpData.numAttempts + 1;
      sendOtp(event);
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
      console.log(jsonData);
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
              setErrors({ ...errors, submit: "" });
              navigate("/login", { replace: true });
            });
          } else {
            // Handle other status codes
            return response.text().then((errorMessage) => {
              const errorObject = JSON.parse(errorMessage);
              setErrors({
                ...errors,
                submit: errorObject.message,
              });
              controller.abort();
            });
          }
        })
        .catch((err) => {
          const errorObject = JSON.parse(err);
          setErrors({ ...errors, submit: errorObject.message });
          console.log(err);
          setDisabled(true);
          setValidated(false);
        });
    }
  };

  return (
<<<<<<< HEAD
    <div className="body-sign">
      <div className="auth-wrapper container">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-12 col-md-9 col-lg-7 col-xl-6">
            <div className="card rounded-3" id="signup-card">
              <div className="card-body p-4">
                <div>
                  <form
                    noValidate
                    validated={validated}
                    onSubmit={submitHandler}
                  >
                    <h3 className="text-center">Sign Up</h3>

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
                      {data.email_format === false && (
                        <span style={{ fontSize: 15, color: "red" }}>
                          {errors.email}{" "}
                        </span>
                      )}

                      {data.email_format ? (
                        <div>
                          <input
                            type="button"
                            value="Verify"
                            className="signup-button"
                            onClick={(e) => sendOtp(e)}
                          />
                          {otpData.otpSent ? (
                            <span style={{ fontSize: 15, color: "green" }}>
                              OTP sent successfully
                            </span>
                          ) : (
                            <span style={{ fontSize: 15, color: "red" }}>
                              {errors.otp}
                            </span>
                          )}
                        </div>
                      ) : null}
                    </div>

                    {otpData.otpSent ? (
                      <div className="mb-3">
                        <label>One Time Password</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter OTP sent to your email"
                          onChange={(e) => {
                            setOtpData({ ...otpData, otp: e.target.value });
                            console.log(otpData.otp);
                          }}
                        />
                        <input
                          type="button"
                          value="Resend OTP"
                          className="signup-button"
                          onClick={(e) => resendOtp(e)}
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
                      <span style={{ fontSize: 15, color: "red" }}>
                        {errors.password}
                      </span>
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
                      <span style={{ fontSize: 15, color: "red" }}>
                        {errors.repeatPassword}
                      </span>
                    </div>

                    <div>
                      <label>Contact Information</label>
                      <div>
                        <PhoneInput
                          required
                          defaultCountry="ca"
                          onChange={(contactNumber) =>
                            setData({ ...data, contactNumber })
                          }
                        />

                        {!isPhoneValid(data.phone) && (
                          <div style={{ color: "red" }}>
                            {errors.contactNumber}
                          </div>
                        )}
                      </div>
                    </div>

                    <span style={{ fontSize: 15, color: "red" }}>
                      {errors.submit}
                    </span>
                    <div>
                      <button
                        type="submit"
                        className="signup-button mb-2 mt-2"
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
=======
    <div className="auth-wrapper container">
      <div className="row d-flex justify-content-center align-items-center h-100">
        <div className="col-12 col-md-9 col-lg-7 col-xl-6">
          <div className="card rounded-3" id="signup-card">
            <div className="card-body p-4">
              <div>
                <form noValidate validated={validated} onSubmit={submitHandler}>
                  <h3 className="text-center">Sign Up</h3>

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
                    {data.email_format === false && (
                      <span style={{ fontSize: 15, color: "red" }}>
                        {errors.email}{" "}
                      </span>
                    )}

                    {data.email_format ? (
                      <div>
                        <input
                          type="button"
                          value="Verify"
                          className="signup-button"
                          onClick={(e) => sendOtp(e)}
                        />
                        {otpData.otpSent ? (
                          <span style={{ fontSize: 15, color: "green" }}>
                            OTP sent successfully
                          </span>
                        ) : (
                          <span style={{ fontSize: 15, color: "red" }}>
                            {errors.otp}
                          </span>
                        )}
                      </div>
                    ) : null}
                  </div>

                  {otpData.otpSent ? (
                    <div className="mb-3">
                      <label>One Time Password</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter OTP sent to your email"
                        onChange={(e) => {
                          setOtpData({ ...otpData, otp: e.target.value });
                          console.log(otpData.otp);
                        }}
                      />
                      <input
                        type="button"
                        value="Resend OTP"
                        className="signup-button"
                        onClick={(e) => resendOtp(e)}
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
                    <span style={{ fontSize: 15, color: "red" }}>
                      {errors.password}
                    </span>
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
                    <span style={{ fontSize: 15, color: "red" }}>
                      {errors.repeatPassword}
                    </span>
                  </div>

                  <div>
                    <label>Contact Information</label>
                    <div>
                      <PhoneInput
                        required
                        defaultCountry="ca"
                        onChange={(contactNumber) =>
                          setData({ ...data, contactNumber })
                        }
                      />

                      {!isPhoneValid(data.phone) && (
                        <div style={{ color: "red" }}>
                          {errors.contactNumber}
                        </div>
                      )}
                    </div>
                  </div>

                  <span style={{ fontSize: 15, color: "red" }}>
                    {errors.submit}
                  </span>
                  <div>
                    <button
                      type="submit"
                      className="signup-button mb-2 mt-2"
                      disabled={disabled}
                    >
                      Sign Up
                    </button>
                  </div>
                  <span className="forgot-password text-right">
                    Already registered? <a href="/login">sign in</a>
                  </span>
                </form>
>>>>>>> 9005127b42abcc77431f4c1a61a0ed43b4ec9999
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
