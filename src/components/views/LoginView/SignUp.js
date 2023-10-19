import React, { Component, useState } from "react";
import { PhoneInput } from 'react-international-phone';
import { PhoneNumberUtil } from 'google-libphonenumber';
import 'react-international-phone/style.css';

export default function SignUp() {
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [verifyButton, setVerifyButton] = useState(false);
  const [otp, setOtp] = useState(0);
  const [otpSent, setotpSent] = useState(false);
  const [OtpVerified, setotpVerified] = useState(false);
  const [phone, setPhone] = useState("");
  const phoneUtil = PhoneNumberUtil.getInstance();

  const isPhoneValid = (phone) => {
    try {
        return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phone));
    } catch (error) {
        return false;
    }
    };

  const emailValid= ( e ) => {
        // don't remember from where i copied this code, but this works.
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let email = e.target.value
        if ( re.test(email) && email.endsWith('utoronto.ca') ) {
            // this is a valid email address
            // call setState({email: email}) to update the email
            // or update the data in redux store.
            setVerifyButton(true)
            setEmail(email)
        }
        else {
            <div style={{ color: 'red' }}>Email is not valid. Please enter a valid UofT email.</div>
            setVerifyButton(false)
        }
    }

const sendOtp = (e) => {
    setotpSent(true)
}

const verifyOtp = (e) => {
    setotpVerified(true)
}


  const handleSubmit = (e) => {
    if (userType == "Admin" && secretKey != "AdarshT") {
      e.preventDefault();
      alert("Invalid Admin");
    } else {
      e.preventDefault();

      console.log(fname, lname, email, password);
      fetch("http://localhost:5000/register", {
        method: "POST",
        crossDomain: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          fname,
          email,
          lname,
          password,
          phone,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data, "userRegister");
          if (data.status == "ok") {
            alert("Registration Successful");
          } else {
            alert("Something went wrong");
          }
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
                <form onSubmit={handleSubmit}>
                    <h3>Sign Up</h3>

                    <div className="mb-3">
                        <label>First name</label>
                        <input
                        type="text"
                        className="form-control"
                        placeholder="First name"
                        onChange={(e) => setFname(e.target.value)}
                        />
                    </div>

                    <div className="mb-3">
                        <label>Last name</label>
                        <input
                        type="text"
                        className="form-control"
                        placeholder="Last name"
                        onChange={(e) => setLname(e.target.value)}
                        />
                    </div>

                    <div className="mb-3">
                        <label>Email address</label>
                        <input
                        type="email"
                        className="form-control"
                        placeholder="Enter email"
                        onChange={(e) => emailValid(e)}
                        />
                        {verifyButton? <input
                        type="button"
                        value="Verify"
                        onClick={(e) => sendOtp(e)}
                        style={{
                            backgroundColor:"blue",
                            width:"100%",
                            padding:8, 
                            color:"white",
                            border:"none"}}
                        
                        />: null}
                    </div>

                    {otpSent?  <div className="mb-3">
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
                            backgroundColor:"blue",
                            width:"100%",
                            padding:8, 
                            color:"white",
                            border:"none"}}
                         />
                    </div>: null}

                    <div className="mb-3">
                        <label>Password</label>
                        <input
                        type="password"
                        className="form-control"
                        placeholder="Enter password"
                        onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div className="mb-3">
                        <label>Repeat Password</label>
                        <input
                        type="password"
                        className="form-control"
                        placeholder="Enter password"
                        onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div className="mb-3">
                        <label>Contact Information</label>
                        <div>
                            <PhoneInput
                                defaultCountry="ua"
                                value={phone}
                                onChange={(phone) => setPhone(phone)}
                            />

                            {!isPhoneValid(phone) && <div style={{ color: 'red' }}>Phone is not valid</div>}
                        </div>
                    </div>



                    <div className="d-grid">
                        <button type="submit" className="btn btn-primary">
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