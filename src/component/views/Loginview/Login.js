import React from 'react';
import logo from '../../../assets/img/logo2.png'
import './style.css';
import { Link } from "react-router-dom"



const LogIn = () => {
    return (
      <div class="col-md-6 offset-md-3 info">
          <div class="login">
          <img class="center" src={logo} alt="loading..."/>
          <p class="text-center">Losing something is frustrating, but trying to find it by retracing your steps and searching for hours, and taking multiple trips to the lost & found to check for it is even more frustrating.</p>
          <p class="text-center typewriter">Let's make this process simpler for you!</p>
          <Link to={"/home"}><button class="btn btn-md text-center">Log In</button></Link>
          </div>
      </div>
      );
}

export default LogIn;