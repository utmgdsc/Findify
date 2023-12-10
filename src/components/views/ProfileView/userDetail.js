import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import "./style.css";
import fetcher from "../../../fetchHelper";
import NavBar from "../../common/NavBar";
import Footer from '../../common/Footer';

export default function UserProfile () {
  const token = localStorage.getItem("token");
  let navigate = useNavigate();

  const [disabled, setDisabled] = useState(true);
  const [userDetails, setUserDetails] = useState({ email: '', firstName: '', lastName: '', contactNumber: '' })

  useEffect(() => {
    getUserDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getUserDetails = () => {

    fetcher('user/getUser')
      .then((res) => {
        if (res.status === 200) {
          return res.json().then((json) => {
            setUserDetails({
              email: json.user.email,
              firstName: json.user.firstName,
              lastName: json.user.lastName,
              contactNumber: json.user.contactNumber
            })
          })
        } else {
          if (token === null) {
            alert("Sorry, looks like you're not logged in. Click ok to be redirected back to the login page");
            navigate("/login", { replace: true });
          } else {

          }
        }
      }).catch((err) => console.error(err))
  }

  const firstNameHandler = (e) => {
    setUserDetails({ ...userDetails, firstName: e.target.value })
  }
  const lastNameHandler = (e) => {
    setUserDetails({ ...userDetails, lastName: e.target.value })
  }
  const contactNumberHandler = (e) => {
    setUserDetails({ ...userDetails, contactNumber: e.target.value })
  }
  const editHandler = (e) => {
    setDisabled(false);
  }

  const cancelHandler = (e) => {
    getUserDetails();
    setDisabled(true);
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    setDisabled(true);
    return fetch("http://localhost:3000/user/edit", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        'Accept': 'application/json',
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userDetails),
    }).then((res) => {
      console.log('SUCCESS!', res);
    }).catch((err) => {
      console.error('ERROR!', err);
      getUserDetails();
    })
  }

  const Buttons = () => {

    if (disabled) {
      return <button className="btn btn-secondary" onClick={ editHandler }>Edit Profile</button>
    }
    return (
      <>
        <button className="btn btn-primary" onClick={ submitHandler }>Save Changes</button>
        <button className="btn btn-secondary mx-3" onClick={ cancelHandler }>Cancel Edit</button>
      </>)
  }

  return (
    <>
      <NavBar />
      <div className="col-md-6 px-4 mx-auto my-5">
        <div className="card mb-4 mt-4">
          <div className="card-header text-center fw-bold">USER PROFILE</div>
          <div className="card-body justify-content-center">
            <div className="card col-md-10 mx-auto p-3 mt-3 mb-5">
              <form noValidate onSubmit={ submitHandler }>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label mb-0">Email</label>
                  <input type="email" className="form-control" id="email" disabled value={ userDetails.email } />
                </div>
                <div className="mb-3">
                  <label htmlFor="firstName" className="form-label mb-0">First Name</label>
                  <input type="text" className="form-control" id="firstName" disabled={ disabled }
                    value={ userDetails.firstName } onChange={ (e) => firstNameHandler(e) } />
                </div>
                <div className="mb-3">
                  <label htmlFor="lastName" className="form-label mb-0">Last Name</label>
                  <input type="text" className="form-control" id="lastName" disabled={ disabled }
                    value={ userDetails.lastName } onChange={ (e) => lastNameHandler(e) } />
                </div>
                <div className="mb-3">
                  <label htmlFor="contactNumber" className="form-label mb-0">Contact Number</label>
                  <input type="tel" className="form-control" id="contactNumber" disabled={ disabled }
                    value={ userDetails.contactNumber } onChange={ (e) => contactNumberHandler(e) } />
                </div>
              </form >
              <div className="justify-content-start mt-2 mb-3">
                <Buttons />
              </div>
            </div >
          </div>
        </div>
      </div>
      <Footer />
    </>
  );

}