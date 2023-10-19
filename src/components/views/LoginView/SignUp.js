import React, { Component, useState } from "react";
import { PhoneInput } from 'react-international-phone';
import { PhoneNumberUtil } from 'google-libphonenumber';
import 'react-international-phone/style.css';

export default function SignUp() {

    const [data, setData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phone: "",
        email_format: false
    });
    const [errors, setErrors] = useState({
        firstName: "",
        lastName: "",
        email: "",
        username: "",
        password: "",
        address: "",
        phone_number: ""
    });

    const [otpData, setOtpData] = useState({
        otp:"",
        otpVerified:false,
        optSent:false,
    })

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
            setData({ ...data, email_format: true})
            setData({ ...data, email: email})
            console.log(data.email_format)
        }
        else {
            <div style={{ color: 'red' }}>Email is not valid. Please enter a valid UofT email.</div>
            setData({ ...data, email_format: false})
        }
    }


  const handleSubmit = (e) => {
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
                        onChange={(e) => setData({ ...data, firstName: e.target.value})}
                        />
                    </div>

                    <div className="mb-3">
                        <label>Last name</label>
                        <input
                        type="text"
                        className="form-control"
                        placeholder="Last name"
                        onChange={(e) =>  setData({ ...data, lastName: e.target.value})}
                        />
                    </div>

                    <div className="mb-3">
                        <label>Email address</label>
                        <input
                        type="email"
                        className="form-control"
                        placeholder="Enter email"
                        onChange={(e) => emailValid(e)}/>

                        {data.email_format? <input
                        type="button"
                        value="Verify"
                        onClick={(e) =>  setOtpData({ ...data, otpSent: true})}
                        style={{
                            backgroundColor:"blue",
                            width:"100%",
                            padding:8, 
                            color:"white",
                            border:"none"}}
                        
                        />: null}
                    </div>

                    {otpData.otpSent?  <div className="mb-3">
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
                        onChange={(e) =>  setData({ ...data, password: e.target.value})}
                        />
                    </div>

                    <div className="mb-3">
                        <label>Repeat Password</label>
                        <input
                        type="password"
                        className="form-control"
                        placeholder="Enter password"
                        onChange={(e) => setData({ ...data, password: e.target.value})}
                        />
                    </div>

                    <div className="mb-3">
                        <label>Contact Information</label>
                        <div>
                            <PhoneInput
                                defaultCountry="ca"
                                onChange={(phone) => setData({ ...data, phone: phone})}
                            />

                            {!isPhoneValid(data.phone) && <div style={{ color: 'red' }}>Phone is not valid</div>}
                        </div>
                    </div>



                    <div className="d-grid">
                        <button type="submit" className="btn btn-primary" disabled = {otpData.otpVerified}>
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