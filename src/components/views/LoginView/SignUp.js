import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import validator from "validator";
import { PhoneInput } from "react-international-phone";
import { PhoneNumberUtil } from "google-libphonenumber";
import "react-international-phone/style.css";

export default function SignUp() {
  let navigate = useNavigate();
  const [disabled, setDisabled] = useState(false);
  const [validated, setValidated] = useState(false);
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    repeatPassword: "",
    phone_number: "",
  });
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    repeatPassword: "",
    phone_number: "",
    otp: "",
  });

  const [otpData, setOtpData] = useState({
    otp: "",
    otpVerified: false,
    otpSent: false,
    numAttempts: 0,
  });

  const phoneUtil = PhoneNumberUtil.getInstance();

  const isPhoneValid = (phone) => {
    try {
      return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phone));
    } catch (error) {
      return false;
    }
  };

  const emailValid = (e) => {
    let email = e.target.value;
    if (validator.isEmail(email) && email.endsWith("mail.utoronto.ca")) {
      setData({ ...data, email: email, email_format: true });
      setDisabled(false);
    } else {
      setData({ ...data, email_format: false });
      setOtpData({ ...otpData, otpSent: false });
      setDisabled(true);
    }
  };

  const updateEmail = (event) => {
    const email = event.target.value;
    if (!validator.isEmail(email) || !email.endsWith("mail.utoronto.ca")) {
      setErrors({ ...errors, email: "email address is invalid" });
      setDisabled(true);
    } else {
      setData({ ...data, email });
      setErrors({ ...errors, email: "" });
      setDisabled(false);
    }
  };

  const updatePassword = (e) => {
    const password = e.target.value;
    if (password === "" || password === undefined || password === null) {
      setErrors({ ...errors, password: "password is required" });
      setDisabled(true);
    } else {
      setData({ ...data, password });
      setErrors({ ...errors, password: "" });
      setDisabled(false);
    }
  };

  const updatecontactNumber = (val) => {
    if (!validator.isMobilePhone(val + "", "any", { strictMode: true })) {
      setErrors({ ...errors, contactNumber: "contact number is invalid" });
      setDisabled(true);
    } else {
      setData({ ...data, contactNumber: val });
      setErrors({ ...errors, contactNumber: "" });
      setDisabled(false);
    }
  };

  const sendOtp = async (event) => {
    event.preventDefault();
    var controller = new AbortController();
    const signal = controller.signal;
    const data = new FormData();
    data.append("email", data.email);
    return fetch("http://localhost:3000/user/sendOTP", {
      method: "POST",
      body: data,
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
      const formData = new FormData();
      formData.append("firstName", data.firstName);
      formData.append("lastName", data.lastName);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("repeatPassword", data.repeatPassword);
      formData.append("contactNumber", data.contactNumber);
      formData.append("otp", otpData.otp);
      return fetch("http://localhost:3000/user/register", {
        method: "POST",
        body: formData,
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
                      onChange={(e) => emailValid(e)}
                      required
                    />

                    {data.email_format ? (
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
                    ) : null}
                  </div>

                  {otpData.otpSent ? (
                    <div className="mb-3">
                      <label>One Time Password</label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Enter OPT sent to your email"
                        onChange={(e) =>
                          setOtpData({ ...otpData, otp: e.target.value })
                        }
                      />
                      <input
                        type="button"
                        value="Resend OTP"
                        onClick={(e) => resendOtp(e)}
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

                  <div className="mb-3">
                    <label>Password</label>
                    <input
                      required
                      type="password"
                      className="form-control"
                      placeholder="Enter password"
                      onChange={(e) =>
                        setData({ ...data, password: e.target.value })
                      }
                    />
                  </div>

                  <div className="mb-3">
                    <label>Repeat Password</label>
                    <input
                      required
                      type="password"
                      className="form-control"
                      placeholder="Enter password"
                      onChange={(e) =>
                        setData({ ...data, password: e.target.value })
                      }
                    />
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
                        <div style={{ color: "red" }}>Phone is not valid</div>
                      )}
                    </div>
                  </div>

                  <div className="d-grid">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={disabled}
                    >
                      Sign Up
                    </button>
                  </div>
                  <p className="forgot-password text-right">
                    Already registered <a href="/sign-in">sign in?</a>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
