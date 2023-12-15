import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import fetcher from "../../../fetchHelper";
import NavBar from "../../common/NavBar";
import { PhoneInput } from "react-international-phone";
import { PhoneNumberUtil } from "google-libphonenumber";
import "react-international-phone/style.css";

export default function UserProfile() {
  const token = localStorage.getItem("token");
  let navigate = useNavigate();

  const [disabled, setDisabled] = useState(true);
  const [errors, setErrors] = useState({
    password: "",
    repeatPassword: "",
    submit: "",
  });
  const [userDetails, setUserDetails] = useState({
    email: "",
    firstName: "",
    lastName: "",
    contactNumber: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    getUserDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getUserDetails = () => {
    fetcher("user/getUser")
      .then((res) => {
        if (res.status === 200) {
          return res.json().then((json) => {
            setUserDetails({
              email: json.user.email,
              firstName: json.user.firstName,
              lastName: json.user.lastName,
              contactNumber: json.user.contactNumber,
            });
          });
        } else {
          if (token === null) {
            alert(
              "Sorry, looks like you're not logged in. Click ok to be redirected back to the login page"
            );
            navigate("/login", { replace: true });
          } else {
          }
        }
      })
      .catch((err) => console.error(err));
  };

  const firstNameHandler = (e) => {
    setUserDetails({ ...userDetails, firstName: e.target.value });
  };
  const lastNameHandler = (e) => {
    setUserDetails({ ...userDetails, lastName: e.target.value });
  };

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
  const newPasswordHandler = (e) => {
    let regex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,24}$/;
    if (e.target.value && !regex.test(e.target.value)) {
      setErrors({
        ...errors,
        password:
          "Password must contain one digit from 1 to 9, one lowercase letter, one uppercase letter, one special character, no space, and it must be 8-16 characters long ",
        submit: "Fix all errors before submitting.",
      });
    } else {
      setErrors({
        ...errors,
        password: "",
        submit: errors.repeatPassword === "" ? "" : errors.submit,
      });
      setUserDetails({ ...userDetails, newPassword: e.target.value });
    }
  };
  const confirmPasswordHandler = (e) => {
    if (e.target.value !== userDetails.newPassword) {
      setErrors({
        ...errors,
        repeatPassword: "Both passwords do not match.",
        submit: "Fix all errors before submitting.",
      });
    } else {
      setErrors({
        ...errors,
        repeatPassword: "",
        submit: errors.password === "" ? "" : errors.submit,
      });
      setUserDetails({ ...userDetails, confirmPassword: e.target.value });
    }
  };
  const editHandler = (e) => {
    setDisabled(false);
    setErrors({
      ...errors,
      repeatPassword: "",
      submit: "",
    });
  };

  const cancelHandler = (e) => {
    getUserDetails();
    setDisabled(true);
    setErrors({
      ...errors,
      repeatPassword: "",
      submit: "",
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setDisabled(true);

    if (
      errors.submit === "" &&
      errors.password === "" &&
      errors.repeatPassword === ""
    ) {
      const jsonData = {
        email: userDetails.email,
        firstName: userDetails.firstName,
        lastName: userDetails.lastName,
        contactNumber: userDetails.contactNumber,
        newPassword: userDetails.newPassword,
      };
      return fetch("http://localhost:3000/user/edit", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(jsonData),
      })
        .then((response) => {
          if (response.status === 200) {
            return response.json().then((json) => {
              console.log(json);
              setErrors({ ...errors, submit: "" });
            });
          } else {
            // Handle other status codes
            return response.text().then((errorMessage) => {
              const errorObject = JSON.parse(errorMessage);
              setErrors({
                ...errors,
                submit: errorObject.message,
              });
              getUserDetails();
            });
          }
        })
        .catch((err) => {
          const errorObject = JSON.parse(err);
          setErrors({ ...errors, submit: errorObject.message });
          console.log(err);
          getUserDetails();
        });
    }
  };

  const Buttons = () => {
    if (disabled) {
      return (
        <button className="btn btn-secondary" onClick={editHandler}>
          Edit Profile
        </button>
      );
    }
    return (
      <>
        <button
          className="btn btn-primary"
          onClick={submitHandler}
          disabled={errors.submit !== ""}
        >
          Save Changes
        </button>
        <button className="btn btn-secondary mx-3" onClick={cancelHandler}>
          Cancel Edit
        </button>
        <div style={{ fontSize: 12, color: "red" }}>{errors.submit}</div>
      </>
    );
  };

  return (
    <>
      <NavBar />
      <div className="col-md-6 px-4 mx-auto my-5">
        <div className="card mb-4 mt-4">
          <div className="card-header text-center fw-bold">USER PROFILE</div>
          <div className="card-body justify-content-center">
            <div className="card col-md-10 mx-auto p-3 mt-3 mb-5">
              <form noValidate onSubmit={submitHandler}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label mb-0">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    disabled
                    value={userDetails.email}
                  />
                </div>
                <div className="row">
                  <div className="mb-3 col-md-6">
                    <label htmlFor="firstName" className="form-label mb-0">
                      First Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="firstName"
                      disabled={disabled}
                      value={userDetails.firstName}
                      onChange={(e) => firstNameHandler(e)}
                    />
                  </div>
                  <div className="mb-3 col-md-6">
                    <label htmlFor="lastName" className="form-label mb-0">
                      Last Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="lastName"
                      disabled={disabled}
                      value={userDetails.lastName}
                      onChange={(e) => lastNameHandler(e)}
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="contactNumber" className="form-label mb-0">
                    Contact Number
                  </label>

                  <div>
                    <PhoneInput
                      required
                      id="contactNumber"
                      defaultCountry="ca"
                      value={userDetails.contactNumber}
                      disabled={disabled}
                      onChange={(contactNumber) =>
                        setUserDetails({
                          ...userDetails,
                          contactNumber,
                        })
                      }
                    />

                    {!disabled && !isPhoneValid(userDetails.contactNumber) && (
                      <span style={{ color: "red", fontSize: "15px" }}>
                        Enter a valid Phone Number.
                      </span>
                    )}
                  </div>
                </div>

                {/* <input
                    type="tel"
                    className="form-control"
                    id="contactNumber"
                    disabled={disabled}
                    value={userDetails.contactNumber}
                    onChange={(e) => contactNumberHandler(e)}
                  />
                    </div> */}

                {!disabled ? (
                  <>
                    <p className="fw-bold mt-5">Change Password</p>
                    <div className="mb-3">
                      <label htmlFor="newPassword" className="form-label mb-0">
                        New Password
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        id="newPassword"
                        disabled={disabled}
                        onChange={(e) => newPasswordHandler(e)}
                      />
                      <span
                        style={{
                          fontSize: 12,
                          color: "red",
                          lineHeight: "normal",
                        }}
                      >
                        {errors.password}
                      </span>
                    </div>
                    <div className="mb-3">
                      <label
                        htmlFor="confirmPassword"
                        className="form-label mb-0"
                      >
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        id="confirmPassword"
                        disabled={disabled}
                        onChange={(e) => confirmPasswordHandler(e)}
                      />
                      <span style={{ fontSize: 12, color: "red" }}>
                        {errors.repeatPassword}
                      </span>
                    </div>
                  </>
                ) : (
                  <></>
                )}
              </form>
              <div className="justify-content-start mt-2 mb-3">
                <Buttons />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
