import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../views/HomeView/Home.js";
import SignUp from "../views/LoginView/SignUp.js";
import Login from "../views/LoginView/Login.js";
import Landing from "../views/LandingView/Landing.js";
import Profile from "../views/ProfileView/Profile.js";

export default function RouteHandler() {
  return (
    <Routes>
      <Route exact path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/home" element={<Home />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}
