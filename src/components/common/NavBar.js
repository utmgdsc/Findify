import { Link, useMatch, useResolvedPath } from "react-router-dom";
import "./style.css";
const TopNav = () => {
  return (
    <nav className="nav">
      <div id="Logo-navbar">Find.ify</div>
      <ul>
        <CustomLink to="/Home">HOME</CustomLink>
        <CustomLink to="/Profile">PROFILE</CustomLink>

        <CustomLink to="/" onClick={() => localStorage.removeItem("token")}>
          LOGOUT
        </CustomLink>
      </ul>
    </nav>
  );
};

function CustomLink({ to, children, ...props }) {
  const resolvedPath = useResolvedPath(to);
  const isActive = useMatch({ path: resolvedPath.pathname, end: true });

  return (
    <li className={isActive ? "active" : ""}>
      <Link to={to} {...props}>
        {children}
      </Link>
    </li>
  );
}

export default TopNav;
