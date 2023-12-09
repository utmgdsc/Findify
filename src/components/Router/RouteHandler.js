import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../views/HomeView/Home";
import SignUp from "../views/LoginView/SignUp";
import Login from "../views/LoginView/Login";
import Landing from "../views/LandingView/Landing";
import RequestItem from "../views/RequestLostItemView/RequestLost";
import FoundItem from "../views/ReportFoundItemView/ReportFound";
import Match from "../views/MatchView/itemDetail";
import Found from "../views/FoundItemView/itemDetail";
import Claim from "../views/ClaimView/Claim";
import Contact from "../views/EmailAdminView/EmailAdmin";

export default function RouteHandler() {
  return (
    <Routes>
      <Route path="/" exact element={<Landing />} />
      <Route path="/home" element={<Home />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/requestlostitem" element={<RequestItem />} />
      <Route path="/reportFoundItem" element={<FoundItem />} />
      <Route path="/lostitem/:id" element={<Match />} />
      <Route path="/founditem/:id" element={<Found />} />
      <Route path="/claim/:id" element={<Claim />} />
      <Route path="/emailAdmin" element={<Contact />} />
    </Routes>
  );
}
