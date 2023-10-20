import React from "react";
import logo from "../../../assets/img/logo2.png";
import "./style.css";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div class="root col-md-8 justify-content-center">
      <div class="card">
        {/* <img id="Logo" class="" src={logo} alt="loading..."/> */}
        <div id="Logo">Find.ify</div>
        <p class="text-center">
          Losing something is frustrating, but trying to find it by retracing
          your steps and searching for hours, and taking multiple trips to the
          lost & found to check for it is even more frustrating.
        </p>
        <p class="text-center typewriter">
          Let's make this process simpler for you!
        </p>
        <div>
          <Link to={"/login"}>
            <button class="btn btn-md text-center">Log In</button>
          </Link>
          <Link to={"/signup"}>
            <button class="btn btn-md text-center">Signup</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Landing;
