import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import validator from "validator";
import "./style.css";
import { Icon } from "react-icons-kit";
import { eyeOff } from "react-icons-kit/feather/eyeOff";
import { eye } from "react-icons-kit/feather/eye";

export default function Login() {
  let navigate = useNavigate();
  const [disabled, setDisabled] = useState(false);
  const [validated, setValidated] = useState(false);
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    submit: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [type, setType] = useState("password");
  const [icon, setIcon] = useState(eyeOff);

  const handleToggle = () => {
    if (type === "password") {
      setIcon(eye);
      setType("text");
    } else {
      setIcon(eyeOff);
      setType("password");
    }
  };

  const passwordHandler = (e) => {
    setData({ ...data, password: e.target.value });
    setErrors({ ...errors, password: "" });
    setErrors({ ...errors, submit: "" });
  };

  const emailValid = (e) => {
    let email = e.target.value;
    if (validator.isEmail(email) && email.endsWith("mail.utoronto.ca")) {
      setData({ ...data, email });
      setErrors({ ...errors, email: "" });
      setDisabled(false);
    } else {
      setDisabled(true);
      setErrors({ ...errors, email: "email address is invalid" });
    }
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    var controller = new AbortController();
    const signal = controller.signal;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setDisabled(false);
    } else {
      const jsonData = {
        email: data.email,
        password: data.password,
      };
      return fetch("http://localhost:3000/user/login", {
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
              setDisabled(false);
              setValidated(true);
              setErrors({ ...errors, submit: "" });
              localStorage.setItem("token", `${json.token}`);
              navigate("/home", { replace: true });
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
          console.log(err);
          const errorObject = JSON.parse(err);
          setErrors({
            ...errors,
            submit: errorObject.message,
          });
          setValidated(false);
        });
    }
  };

  return (
    <div className="body-sign">
      <div className="auth-wrapper container h-40">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-12 col-md-9 col-lg-7 col-xl-6">
            <div className="card rounded-3" id="signup-card">
              <div className="card-body p-4">
                <div className="auth-inner">
                  <form
                    noValidate
                    validated={validated}
                    onSubmit={submitHandler}
                  >
                    <h3 className="text-center">Log In</h3>
                    <div className="mb-3">
                      <label>Email</label>
                      <input
                        required
                        type="email"
                        className="form-control"
                        placeholder="Email"
                        onChange={(e) => emailValid(e)}
                      />
                      <span style={{ fontSize: 15, color: "red" }}>
                        {errors.email}
                      </span>
                    </div>

                    <div className="mb-3 form-group has-feedback">
                      <label class="control-label">Password</label>
                      <div class="input-group mb-3">
                        <input
                          type={type}
                          className="form-control"
                          placeholder="Password"
                          style={{ width: "80%" }}
                          required
                          value={data.password}
                          autoComplete="current-password"
                          onChange={(e) => passwordHandler(e)}
                        />
                        <div class="input-group-append">
                          <span onClick={handleToggle}>
                            <Icon
                              class="absolute mr-10 input-group-text"
                              icon={icon}
                              size={17}
                            />
                          </span>
                        </div>
                      </div>
                      <span style={{ fontSize: 15, color: "red" }}>
                        {errors.submit}
                      </span>

                      <div>
                        <button
                          type="submit"
                          className="signup-button mb-2"
                          disabled={disabled}
                        >
                          Log In
                        </button>
                      </div>
                      <label className="forgot-password text-right">
                        Not a user? <a href="/signup">Register</a>
                      </label>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
