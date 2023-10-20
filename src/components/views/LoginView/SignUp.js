import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import validator from "validator";
import fetcher from "../../../fetchHelper";
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
    phone_number: "",
  });
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone_number: "",
  });

  const [otpData, setOtpData] = useState({
    otp: "",
    otpVerified: false,
    otpSent: false,
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
    } else {
      <p style={{ color: "red" }}>
        Email is not valid. Please enter a valid UofT email.
      </p>;
      setData({ ...data, email_format: false });
      setOtpData({ ...otpData, otpSent: false });
    }
    console.log(data);
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
    <div class="auth-wrapper container h-40">
      <div class="row d-flex justify-content-center align-items-center h-100">
        <div class="col-12 col-md-9 col-lg-7 col-xl-6">
          <div class="card rounded-3">
            <div class="card-body p-4">
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
                      />
                      <input
                        type="button"
                        value="OTP"
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
                      disabled={otpData.otpVerified}
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
