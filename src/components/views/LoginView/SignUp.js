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
    repeatPassword: "",
    phone: "",
    email_format: false,
    passwordCheck: false,
  });
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    repeatPassword: "",
    phone: "",
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
      // this is a valid email address
      // call setState({email: email}) to update the email
      // or update the data in redux store.
      setData({ ...data, email: email, email_format: true });
      setErrors({ ...data, email: "" });
    } else {
      setErrors({ ...data, email: "Please enter a valid UofT email." });
      setData({ ...data, email_format: false });
      setOtpData({ ...otpData, otpSent: false });
    }
    console.log(data);
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
    const password = e.target.value;
    if (password != data.password) {
      setErrors({
        ...errors,
        password: "Both the passwords do not match.",
      });
      setData({ ...data, confirmpassword: "" });
    } else {
      setErrors({
        ...errors,
        password: "",
      });
      setData({ ...data, confirmpassword: password });
      setData({ ...data });
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
    const postData = new FormData();
    postData.append("email", data.email);
    return fetch("http://localhost:8000/user/sendOTP", {
      mode: "no-cors",
      method: "POST",
      body: postData,
      signal: signal,
    })
      .then((response) => {
        if (response.status === 400) {
          return response.text().then((errorMessage) => {
            alert(`Bad Request: ${errorMessage}`);
            controller.abort();
          });
        }
        if (response.status === 403) {
          return response.text().then((errorMessage) => {
            alert(`Forbidden: ${errorMessage}`);
            controller.abort();
          });
        }
        if (response.status === 200) {
          return response.json().then((json) => {
            console.log(json);
          });
        } else {
          // Handle other status codes
          return response.text().then((errorMessage) => {
            alert(`Unexpected Error: ${errorMessage}`);
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
      return fetch("http://localhost:3000/register", {
        method: "POST",
        body: formData,
        signal: signal,
      })
        .then((response) => {
          if (response.status === 401 || response.status === 403) {
            alert("An error occured please try again");
            controller.abort();
          }
          return response.json();
        })
        .then((json) => {
          console.log(json);
          setDisabled(false);
          setValidated(true);
          localStorage.setItem("token", `${json.token}`);
          navigate("/home", { replace: true });
        })
        .catch((err) => {
          console.log("form", err);
          setDisabled(false);
          setValidated(true);
        });
    }
  };

  return (
    <div className="auth-wrapper container h-40">
      <div className="row d-flex justify-content-center align-items-center h-100">
        <div className="col-12 col-md-9 col-lg-7 col-xl-6">
          <div className="card">
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
                          onClick={(e) =>
                            setOtpData({ ...data, otpSent: e.target.value })
                          }
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
                    {data.passwordCheck != "" && (
                      <span style={{ fontSize: 15, color: "red" }}>
                        {errors.password}{" "}
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
                        <div style={{ color: "red" }}>Phone is not valid</div>
                      )}
                    </div>
                  </div>

                  <div className="d-grid">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={otpData.otpVerified}
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
