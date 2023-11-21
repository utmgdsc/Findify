import { Link, useMatch, useResolvedPath } from "react-router-dom";
import "./style.css";
const TopNav = () => {
  return (
    <nav id="NavBar" className="nav px-5 d-flex justify-content-between align-items-center">
      <CustomLink to='/Home'><div id="Logo-navbar">Find.ify</div></CustomLink>
      <ul className="justify-content-around">
        <CustomLink to="/Home">Home</CustomLink>
        <CustomLink to="/Profile">Profile</CustomLink>

        <CustomLink to="/" onClick={ () => localStorage.removeItem("token") }>
          Sign out
        </CustomLink>
      </ul>
    </nav>
  );
};

function CustomLink ({ to, children, ...props }) {
  const resolvedPath = useResolvedPath(to);
  const isActive = useMatch({ path: resolvedPath.pathname, end: true });

  return (
    <li className={ `nav-links mx-2 px-1 text-center ${isActive ? "active" : ""}` }>
      <Link to={ to } { ...props }>
        { children }
      </Link>
    </li>
  );
}

export default TopNav;
