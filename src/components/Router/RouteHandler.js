import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../views/HomeView/Home";
import SignUp from "../views/LoginView/SignUp";
import Login from "../views/LoginView/Login";
import Landing from "../views/LandingView/Landing";
<<<<<<< HEAD
import RequestItem from "../views/RequestLostItemView/RequestLost";
import FoundItem from "../views/ReportFoundItemView/ReportFound";
import Match from "../views/MatchView/itemDetail";
=======
import RequestLost from "../views/RequestLostItemView/RequestLost";
import LostItem from "../views/LostItemView/LostItem";
import ReportFound from "../views/ReportFoundItemView/ReportFound";
import Matches from "../views/MatchView/Matches";
>>>>>>> 329af38791cdca360d20935e786677731df9f208

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
      <Route path="/lostitem/:id" element={<Match />} />
=======
      <Route path="/requestLostItem" element={<RequestLost />} />
      <Route path="/reportFoundItem" element={<ReportFound />} />
      <Route path="/lostItem" element={<LostItem />} />
      <Route path="/matches/:id" element={<Matches />} />
>>>>>>> 329af38791cdca360d20935e786677731df9f208
    </Routes>
  );
}
