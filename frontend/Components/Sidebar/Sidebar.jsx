import "./Sidebar.css";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div>
      <div className="sidebar">
        <div className="sidebarContainer">
          <NavLink to="/">
            <h4 className="logoTitle">Sport Zaga</h4>
          </NavLink>

          <nav className="profileNavLinks">
            <NavLink to="/profile" className="navItem">
              <i className="bx bx-user-circle"></i>
              <span>Profile</span>
            </NavLink>

            <NavLink to="/orders" className="navItem">
              <i className="bx bx-shopping-bag"></i>
              <span>Orders</span>
            </NavLink>

            <NavLink to="/settings" className="navItem">
              <i className="bx bx-cog"></i>
              <span>Settings</span>
            </NavLink>

            <NavLink to="/repair" className="navItem">
              <i className="bx bx-wrench"></i>
              <span>Add Repair</span>
            </NavLink>

            <NavLink to="/my-repairs" className="navItem">
              <i className="bx bx-history"></i>
              <span>My Repairs</span>
            </NavLink>

            <NavLink to="/my-customization" className="navItem">
              <i className="bx bx-paint"></i>
              <span>My Customization</span>
            </NavLink>

            <NavLink to="/viewMyOrders" className="navItem">
              <i className="bx bx-package"></i>
              <span>My Rentings</span>
            </NavLink>
          </nav>

          <div className="logout">
            <i className="bx bx-log-out"></i>
            <span onClick={handleLogout}>Log out</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
