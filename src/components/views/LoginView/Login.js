import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  let navigate = useNavigate();

  const submitHandler = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    var controller = new AbortController();
    const signal = controller.signal;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      const formData = new FormData();
      formData.append("email", data.email);
      formData.append("password", data.password);
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
          localStorage.setItem("token", `${json.token}`);
          navigate("/home", { replace: true });
        })
        .catch((err) => {
          console.log("form", err);
        });
    }
  };

  return (
    <div class="auth-wrapper">
      <div class="row d-flex justify-content-center align-items-center h-100">
        <div class="col-12 col-md-9 col-lg-7 col-xl-6">
          <div class="card rounded-3">
            <div class="card-body p-4">
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
                      onChange={(e) =>
                        setData({ ...data, email: e.target.value })
                      }
                    />
                  </div>

                  <div className="mb-3">
                    <label>Password</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Password"
                      required
                      onChange={(e) =>
                        setData({ ...data, password: e.target.value })
                      }
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
};

export default Login;
