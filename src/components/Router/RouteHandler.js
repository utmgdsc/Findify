import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "../views/LoginView/Login";
import Home from "../views/HomeView/Home";
import SignUp from "../views/LoginView/SignUp"


export default function RouteHandler() {

    return(
        <Routes>
            <Route exact path="/" element={<Login/>}/>
            <Route path="/home" element={<Home/>}/>
            <Route path="/signup" element={<SignUp/>}/>
        </Routes>
    )
}