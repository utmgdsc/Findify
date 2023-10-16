import { Link, useMatch, useResolvedPath } from "react-router-dom"
import './style.css'
import logo from '../../assets/img/findify_nav_logo.png'
const TopNav = () => {
  return (
    <nav className="nav">
      <img src={logo} width="100" height="40" alt=""/>
      <ul>
        <CustomLink to="/Home">Home</CustomLink>
        <CustomLink to="/Profile">Profile</CustomLink>
        <CustomLink to="/">Logout</CustomLink>
      </ul>
    </nav>
  )
}

function CustomLink({ to, children, ...props }) {
  const resolvedPath = useResolvedPath(to)
  const isActive = useMatch({ path: resolvedPath.pathname, end: true })

  return (
    <li className={isActive ? "active" : ""}>
      <Link to={to} {...props}>
        {children}
      </Link>
    </li>
  )
}

export default TopNav;