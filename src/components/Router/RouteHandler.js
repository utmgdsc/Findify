import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../views/HomeView/Home";
import SignUp from "../views/LoginView/SignUp";
import Login from "../views/LoginView/Login";
import Landing from "../views/LandingView/Landing";
<<<<<<< HEAD
import RequestItem from "../views/RequestLostItemView/RequestLost";
import FoundItem from "../views/ReportFoundItemView/ReportFound";
import Match from "../views/MatchView/Match";
=======
>>>>>>> 9005127b42abcc77431f4c1a61a0ed43b4ec9999

export default function RouteHandler() {
  return (
    <Routes>
      <Route path="/" exact element={<Landing />} />
      <Route path="/home" element={<Home />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
<<<<<<< HEAD
      <Route path="/requestlostitem" element={<RequestItem />} />
      <Route path="/reportFoundItem" element={<FoundItem />} />
      <Route path="/match" element={<Match />} />
=======
>>>>>>> 9005127b42abcc77431f4c1a61a0ed43b4ec9999
    </Routes>
  );
}
