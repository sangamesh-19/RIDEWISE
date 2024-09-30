import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import profile from "../../assets/profile.png";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };


  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleLogout = () => {
    // Perform any logout operations here, such as clearing user data, etc.
    navigate("/"); // Navigate to the Login page
  };

  const handleHistory = () => {
    // Perform any logout operations here, such as clearing user data, etc.
    navigate("/history"); // Navigate to the Login page
  };

  const desktopMenu = [
    { name: "History", action: handleHistory },
    { name: "Log Out", action: handleLogout },
  ];

  const mobileMenu = [
    { name: "Home", action: () => navigate("/dashboard") },
    { name: "Analytics", action: () => navigate("/analytics") },
    ...desktopMenu,
  ];

  const Menu = isMobile ? mobileMenu : desktopMenu;

  return (
    <div className="Navbar">
      <h1 className="logo">RIDEWISE</h1>
      {!isMobile && (
        <ul className="navitem">
          <Link to="/dashboard" className="Home">
            <li className="Home">Home</li>
          </Link>
          <Link to="/analytics" className="Analytics">
            <li className="Analytics">Analytics</li>
          </Link>
        </ul>
      )}
      <div className="relative">
        <img
          className="profile-icon cursor-pointer"
          src={profile}
          alt="profile"
          onClick={toggleDropdown}
        />
        {isDropdownOpen && (
          <div className="dropdown">
            <ul>
              {Menu.map((menu, index) => (
                <li key={index} className="dropdown-item" onClick={menu.action}>
                  {menu.name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};


export default Navbar;
