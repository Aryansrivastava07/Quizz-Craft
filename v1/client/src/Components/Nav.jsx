// 📁 Nav.js
import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTheme } from "./ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import { faMoon, faSun, faUser, faSignOutAlt, faUserTie, faBars, faTimes, faHome, faQuestionCircle, faInfoCircle, faEnvelope, faTachometerAlt, faPlus, faSignInAlt } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { userAPI } from "../utils/api";

const TogledarkMode = (darkMode) => {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", darkMode ? "dark" : "light");
};

export const Nav = ({ children }) => {
  const { darkMode, setDarkMode } = useTheme();
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [userAvatar, setUserAvatar] = useState(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Fetch user avatar when component mounts or user changes
  useEffect(() => {
    const fetchUserAvatar = async () => {
      if (isLoggedIn && user) {
        try {
          const avatarResponse = await userAPI.getAvatar();
          if (avatarResponse.success && avatarResponse.data) {
            // Check for avatarUrl first, then fallback to profilePicture
            const rawAvatarUrl = avatarResponse.data.avatarUrl || avatarResponse.data.profilePicture;
            
            if (rawAvatarUrl) {
              const processedUrl = rawAvatarUrl.startsWith('http') 
                ? rawAvatarUrl 
                : `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}${rawAvatarUrl}`;
              setUserAvatar(processedUrl);
            } else {
              setUserAvatar(null);
            }
          } else {
            setUserAvatar(null);
          }
        } catch (error) {
          setUserAvatar(null);
        }
      } else {
        setUserAvatar(null);
      }
    };

    fetchUserAvatar();
  }, [isLoggedIn, user]);

  const handleLogout = async () => {
    await logout();
    navigate('/auth/login');
    setShowDropdown(false);
  };

  return (
    <nav className="h-[10vh] fixed top-0 w-screen z-50 flex items-center justify-between px-4 sm:px-6 lg:px-8 backdrop-blur-2xl border-b-2 border-gray-200 bg-[#ffffffb2] backdrop:blur-md dark:bg-[#0f1726] dark:border-gray-800 transition-colors duration-500">
      <div className="flex items-center gap-2 sm:gap-3 lg:gap-5 text-gray-900 dark:text-white">
        <img
          src="/logo2.png"
          alt="logo"
          className="w-12 sm:w-16 lg:w-18 cursor-pointer"
          height="500"
          width="500"
          onClick={() => navigate("/")}
        />
        <div className="relative w-10 sm:w-12 h-6 sm:h-8 rounded-full p-1 bg-gray-200 dark:bg-gray-700 transition-all duration-300 ease-in-out cursor-pointer" style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px -50px 36px -28px inset " }}
        onClick={() => {
              setDarkMode(!darkMode);
              TogledarkMode(!darkMode);
            }}>
          
          <div
            className="toggle absolute top-1/2 -left-0 h-7 sm:h-9 w-7 sm:w-9 rounded-full bg-gray-600 dark:bg-[#242c3c] -translate-y-1/2 -translate-x-2 sm:-translate-x-3 dark:translate-x-3 sm:dark:translate-x-5 rotate-0 dark:rotate-720 transition-all duration-300 grid place-items-center"
            style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px -50px 36px -28px inset" }}
          >
            {darkMode ? (
              <FontAwesomeIcon icon={faMoon} className="text-white text-xs sm:text-sm" />
            ) : (
              <FontAwesomeIcon icon={faSun} className="text-amber-300 text-xs sm:text-sm" />
            )}
          </div>
        </div>
      </div>
      <menu className="relative flex items-center justify-between flex-wrap">
        {/* Desktop Navigation */}
        <div className="hidden sm:flex items-center">
          {children}
        </div>
        
        {/* Hamburger Menu Button (Mobile Only) */}
        <button
          className="sm:hidden flex items-center justify-center w-8 h-8 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors z-50 relative"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
        >
          <FontAwesomeIcon 
            icon={showMobileMenu ? faTimes : faBars} 
            className="text-lg"
          />
        </button>

        {/* User Profile */}
        {isLoggedIn ? (
          <div className="relative ml-2 sm:ml-4">
            <div 
              className="flex items-center cursor-pointer p-1 sm:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              onClick={() => setShowDropdown(!showDropdown)}
              onMouseEnter={() => setShowDropdown(true)}
            >
              {userAvatar ? (
                <img
                  src={userAvatar}
                  alt="Profile"
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-indigo-200 dark:border-indigo-400 object-cover"
                  onError={(e) => {
                    console.log('Navbar - Image failed to load:', userAvatar);
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div 
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-indigo-200 dark:border-indigo-400 bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center ${userAvatar ? 'hidden' : 'flex'}`}
              >
                <FontAwesomeIcon 
                  icon={faUserTie} 
                  className="text-white text-xs sm:text-sm"
                />
              </div>
            </div>
            
            {showDropdown && (
              <div 
                className="absolute right-0 mt-2 w-44 sm:w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 z-20"
                onMouseLeave={() => setShowDropdown(false)}
              >
                <div className="py-2">
                  <button
                    onClick={() => {
                      navigate('/Dashboard');
                      setShowDropdown(false);
                    }}
                    className="flex items-center gap-3 w-full px-3 sm:px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors min-h-[40px] rounded-lg"
                  >
                    <FontAwesomeIcon icon={faTachometerAlt} />
                    Dashboard
                  </button>
                  <hr className="my-1 border-gray-200 dark:border-gray-600" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-3 sm:px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors min-h-[40px] rounded-lg"
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : null}
      </menu>
      
      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <>
          {/* Background Overlay */}
          <div 
            className="sm:hidden fixed inset-0 top-[10vh] bg-black bg-opacity-50 z-40"
            onClick={() => setShowMobileMenu(false)}
          />
          {/* Menu Content */}
          <div className="sm:hidden fixed left-0 right-0 top-[10vh] bg-white dark:bg-gray-900 z-60 border-t border-gray-200 dark:border-gray-700 backdrop-blur-sm shadow-lg">
            <div className="flex flex-col p-4 space-y-2">
              {React.Children.map(children, (child) => {
                if (!child || !React.isValidElement(child)) {
                  return child;
                }
                return React.cloneElement(child, {
                  onClick: (e) => {
                    if (child.props.onClick) {
                      child.props.onClick(e);
                    }
                    setShowMobileMenu(false);
                  }
                });
              })}
            </div>
          </div>
        </>
      )}
    </nav>
  );
};

export function anchor(name, link, special = false) {
  const baseClasses =
    "flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors rounded-lg min-h-[40px] justify-center mb-2 sm:mb-0 mr-0 sm:mr-2 lg:mr-3 pl-8";
  const normalClasses =
    "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800";
  const specialClasses =
    "bg-[#ff563c] text-white hover:bg-[#ae2929] dark:bg-[#cc3c29] dark:hover:bg-[#992121]";
  const activeClasses =
    "bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600";

  // Map page names to icons
  const getIcon = (pageName) => {
    switch(pageName.toLowerCase()) {
      case 'home':
        return faHome;
      case 'make a quiz':
      case 'makequiz':
      case 'make quiz':
        return faPlus;
      case 'join a quiz':
      case 'joinquiz':
      case 'join quiz':
        return faSignInAlt;
      case 'login':
        return faSignInAlt;
      case 'about':
        return faInfoCircle;
      case 'contact':
        return faEnvelope;
      case 'dashboard':
        return faTachometerAlt;
      default:
        return null;
    }
  };

  let classes = baseClasses;
  if (special) {
    classes += " " + specialClasses;
  } else {
    classes += " " + normalClasses;
  }

  const icon = getIcon(name);

  return (
    <NavLink
      to={`/${link}`}
      className={({ isActive }) =>
        isActive && !special
          ? `${baseClasses} ${activeClasses}`
          : classes
      }
    >
      {icon && <FontAwesomeIcon icon={icon} />}
      <span>{name}</span>
    </NavLink>
  );
}