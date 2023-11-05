import React from "react";
import "./style.css";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="root col-md-8 justify-content-center">
      <div className="card" id="card1">
        {/* <img id="Logo" class="" src={logo} alt="loading..."/> */}
        <div id="Logo">Find.ify</div>
        <p className="text-center">
          Losing something is frustrating, but trying to find it by retracing
          your steps and searching for hours, and taking multiple trips to the
          lost & found to check for it is even more frustrating.
        </p>
        <p className="text-center typewriter">
          Let's make this process simpler for you!
        </p>
        <div>
          <Link to={"/login"}>
            <button className="btn btn-md text-center">Log In</button>
          </Link>
          <Link to={"/signup"}>
            <button className="btn btn-md text-center">Signup</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Landing;
