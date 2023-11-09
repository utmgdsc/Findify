import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../views/HomeView/Home";
import SignUp from "../views/LoginView/SignUp";
import Login from "../views/LoginView/Login";
import Landing from "../views/LandingView/Landing";
import RequestItem from "../views/RequestLostItemView/RequestLost";
import LostItem from "../views/LostItemView/LostItem";
import FoundItem from "../views/ReportFoundItemView/ReportFound";

export default function RouteHandler() {
  return (
    <Routes>
      <Route path="/" exact element={<Landing />} />
      <Route path="/home" element={<Home />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/requestLostItem" element={<RequestItem />} />
      <Route path="/reportFoundItem" element={<FoundItem />} />
      <Route path="/lostItem" element={<LostItem />} />
    </Routes>
  );
}
