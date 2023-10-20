import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import validator from "validator";
import "./style.css";

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
  });

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
              console.log(json);
              setDisabled(false);
              setValidated(true);
              localStorage.setItem("token", `${json.token}`);
              navigate("/home", { replace: true });
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
                  <h3>Log In</h3>
                  <div className="mb-3">
                    <label>Email</label>
                    <input
                      required
                      type="email"
                      className="form-control"
                      placeholder="Email"
                      onChange={(e) => emailValid(e)}
                    />
                  </div>

                  <div className="mb-3">
                    <label>Password</label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Password"
                      required
                      onChange={(e) => updatePassword(e)}
                    />
                    <div>
                      <button type="submit" className="btn btn-primary">
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
  );
}
