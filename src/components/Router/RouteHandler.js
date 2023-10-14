import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "../views/LoginView/Login";
import Home from "../views/HomeView/Home";
import NavBar from "../common/NavBar";

export default function RouteHandler() {

    return(
        <Routes>
            <Route exact path="/" element={<Login/>}/>
            <Route path="/navbar" element={<NavBar/>}/>
            <Route path="/home" element={<Home/>}/>
        </Routes>
    )
}