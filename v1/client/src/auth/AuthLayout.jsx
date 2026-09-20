import { Outlet, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun, faHome } from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "../Components/ThemeContext";

const TogledarkMode = (darkMode) => {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", darkMode ? "dark" : "light");
};

export const AuthLayout = () => {
  const { darkMode, setDarkMode } = useTheme();
  const navigate = useNavigate();

  return (
  <div className="h-screen w-screen bg-gradient-to-b from-[#fefefe] to-[#030b2b5f] dark:from-[#0f1726] dark:to-gray-950 shadow-[0_-15px_25px_-10px_rgba(0,0,0,0.1)]">
    {/* Simple Navbar */}
    <nav className="h-[10vh] w-full flex items-center justify-between px-4 sm:px-6 lg:px-8 backdrop-blur-sm bg-white/10 dark:bg-gray-900/10 border-b border-gray-200/20 dark:border-gray-700/20">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <img
          src="/logo2.png"
          alt="logo"
          className="w-10 sm:w-12 cursor-pointer"
          onClick={() => navigate("/")}
        />
        <span className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white">QuizCraft</span>
      </div>
      
      {/* Navigation Items */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Home Button */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <FontAwesomeIcon icon={faHome} />
          <span className="hidden sm:inline">Home</span>
        </button>
        
        {/* Dark Mode Toggle */}
        <div 
          className="relative w-10 sm:w-12 h-6 sm:h-8 rounded-full p-1 bg-gray-200 dark:bg-gray-700 transition-all duration-300 ease-in-out cursor-pointer" 
          style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px -50px 36px -28px inset" }}
          onClick={() => {
            setDarkMode(!darkMode);
            TogledarkMode(!darkMode);
          }}
        >
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
    </nav>
    
    {/* Auth Content */}
    <div className="h-[90vh] w-full grid place-items-center">
      <div className="min-h-[80vh] w-[80vw] m-auto bg-white rounded-2xl shadow-2xl p-5 grid grid-cols-1 lg:grid-cols-2 bg-gradient-to-l dark:from-gray-950 dark:to-gray-900 from-[#5a5d685f] to-[#fefefe]">
        <div className="hidden lg:grid place-items-center">
          <img
            src="/logo2.png"
            alt=""
            className="w-[90%] aspect-auto"
          />
        </div>
        <div className="grid grid-rows-[auto_20px] dark:text-white">
          <Outlet />
        </div>
      </div>
    </div>
  </div>
  );
};
// export const AuthLayout = () => (
//   <div className="h-[90vh] w-screen grid place-items-center
//   bg-gradient-to-b from-[#b8b8b837] to-[#1b213722]
//    dark:from-gray-950 dark:to-gray-900 shadow-[0_-15px_25px_-10px_rgba(0,0,0,0.1)] ">
//       <div className="min-h-[80vh] w-[80vw] m-auto bg-white rounded-2xl shadow-2xl p-5 grid grid-cols-2 bg-gradient-to-t from-slate-900 to-slate-800 ">
//         <div className="grid place-items-center">
//           <img
//             src="/logo2.png"
//             alt=""
//             className="w-[90%] aspect-auto"
//           />
//         </div>
//         <div className="grid grid-rows-[auto_20px] dark:text-white">
//           <Outlet />
//         </div>
//       </div>
//     </div>
// );
