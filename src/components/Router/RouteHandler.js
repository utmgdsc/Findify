import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../views/HomeView/Home";
import SignUp from "../views/LoginView/SignUp";
import Login from "../views/LoginView/Login";
import Landing from "../views/LandingView/Landing";

export default function RouteHandler() {
  return (
    <Routes>
      <Route path="/" exact element={<Landing />} />
      <Route path="/home" element={<Home />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}
