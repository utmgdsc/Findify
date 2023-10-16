import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import validator from "validator";
import fetcher from "../../../fetchHelper";

export default function SignUp() {

    let navigate = useNavigate();
    const [disabled, setDisabled] = useState(false);
    const [validated, setValidated] = useState(false);
    const [data, setData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        username: "",
        password: "",
        address: "",
        phone_number: ""
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
    
    const updateFirstName = (e) => {
        setData({ ...data, firstName: e.target.value})
      };
    
    
      const updateLastName = (e) => {
        setData({ ...data, lastName: e.target.value})
      };
    
    const updateEmail = (event) => {
        const email = event.target.value
        if (!validator.isEmail(email) || !email.endsWith("mail.utoronto.ca")) {
            setErrors({ ...errors, email: "email address is invalid" });
            setDisabled(true);
        } else {
            setData({ ...data, email });
            setErrors({ ...errors, email: "" });
            setDisabled(false);
        }
    };

    const updateUsername = (e) => {
        const username = e.target.value;
        if (username === "" || username === undefined || username === null) {
            setErrors({ ...errors, username: "username is required" });
            setDisabled(true);
        } else {
            setData({ ...data, username });
            setErrors({ ...errors, username: "" });
            setDisabled(false);
        }
    };

    const updatePassword = (e) => {
        const password = e.target.value;
        if (password === "" || password === undefined || password === null) {
            setErrors({ ...errors, password: "password is required" });
            setDisabled(true);
        } else {
            setData({ ...data, password});
            setErrors({ ...errors, password: "" });
            setDisabled(false);
        }
    };

    const updateAddress = (e) => {
        const address = e.target.value;
        if (password === "" || password === undefined || password === null) {
            setErrors({ ...errors, password: "password is required" });
            setDisabled(true);
        } else {
            setData({ ...data, password});
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

    const submitHandler = async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        var controller = new AbortController();
        const signal = controller.signal
        setDisabled(true);
        if (form.checkValidity() === false) {
          event.stopPropagation();
          setDisabled(false);
        } else {
          const formData = new FormData();
          formData.append("firstName", data.firstName);
          formData.append("lastName", data.lastName);
          formData.append("email", data.email);
          formData.append("username", data.username);
          formData.append("password", data.password);
          formData.append("address", data.address);
          formData.append("contactNumber", data.contactNumber);
          return fetch('http://localhost:3000/register', {
            method: "POST",
            body: formData,
            signal: signal
          })
            .then((response) => {
              if (response.status === 401 || response.status === 403){
                alert("An error occured please try again")
                controller.abort();
              }
              return response.json();
            })
            .then((json) => {
              console.log(json);
              setDisabled(false);
              setValidated(true);
              localStorage.setItem('token', `${json.token}`);
              navigate("/home", { replace: true });
            })
            .catch((err) => {
                console.log("form", err);
                setDisabled(false);
                setValidated(true);
            });
        }
      };

    return(
        <h1>Sign Up page</h1>
    )
}