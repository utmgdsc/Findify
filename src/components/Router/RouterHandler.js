import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../views/HomeView/Home.js";
import Login from "../views/LoginView/Login.js";
import Profile from "../views/ProfileView/Profile.js";


export default function RouteHandler() {
  return (
    <Routes>
      <Route exact path="/" element={<Login/>} />
      <Route path="/home" element={<Home/>} />
      <Route path="/profile" element={<Profile/>} />
    </Routes>
  );
}