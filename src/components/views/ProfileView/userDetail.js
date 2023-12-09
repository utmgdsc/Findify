import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./style.css";
import fetcher from "../../../fetchHelper";
import { useParams } from "react-router-dom";
import NavBar from "../../common/NavBar";

export default function UserProfile () {
  const { id } = useParams();
  const token = localStorage.getItem("token");
  let navigate = useNavigate();

  const [userDetails, setUserDetails] = useState({
    email: '', firstName: '', lastName: '', contactNumber: '', queryLimit: ''
  })

  useEffect(() => {
    getUserDetails();
  }, []);

  const getUserDetails = () => {
    if (localStorage.getItem("token") === null) {
      alert(
        "Sorry, looks like you're not logged in. Click ok to be redirected back to the login page"
      );
      navigate("/login", { replace: true });
    } else {
      
    }
  }

}