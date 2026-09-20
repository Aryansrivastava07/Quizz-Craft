import { useState, useEffect, React } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGear,
  faBell,
  faCalendarDays,
  faUserTie,
  faPenFancy,
  faCircleCheck,
  faStar,
  faPencil,
} from "@fortawesome/free-solid-svg-icons";
import { faIdBadge } from "@fortawesome/free-regular-svg-icons";
import { userAPI, quizAPI, attemptAPI } from "../utils/api";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "./ThemeContext";

export const Profile = ({ userData: propUserData, dashboardStats, loading: propLoading, error: propError, refreshUserData }) => {
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const [editable, seteditable] = useState(false);
  const [profileImg, setProfileImg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        // Show preview immediately
        setProfileImg(URL.createObjectURL(file));
        
        // Upload to backend
        const response = await userAPI.uploadAvatar(file);
        
        if (response.success) {
          // Update the profile image URL from backend
          // Check if it's a Cloudinary URL (full URL) or local path
          const avatarUrl = response.data.avatarUrl.startsWith('http') 
            ? response.data.avatarUrl 
            : `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}${response.data.avatarUrl}`;
          setProfileImg(avatarUrl);
          
          // Refresh dashboard data to update avatar across all components
          if (refreshUserData) {
            refreshUserData();
          }
        } else {
          console.error('Avatar upload failed:', response.message);
          setError('Failed to upload avatar. Please try again.');
        }
      } catch (error) {
        console.error('Error uploading avatar:', error);
        setError('Failed to upload avatar. Please try again.');
      }
    }
  };

  const [userData, setUserData] = useState({
    name: propUserData?.name || "",
    joined: propUserData?.joined || "",
    email: propUserData?.email || "",
    number: propUserData?.number || "",
    password: propUserData?.password || "",
    quizCreated: dashboardStats?.quizzesCreated || 0,
    quiSubmited: dashboardStats?.quizzesAttempted || 0,
    averageScore: dashboardStats?.averageScore || 0,
    address: propUserData?.address || "",
    dob: propUserData?.dob || "",
    username: propUserData?.username || "",
  });

  // Update local state when props change
  useEffect(() => {
    if (propUserData) {
      setUserData({
        name: propUserData.name || "",
        joined: propUserData.joined || "",
        email: propUserData.email || "",
        number: propUserData.number || "",
        password: propUserData.password || "",
        quizCreated: dashboardStats?.quizzesCreated || 0,
        quiSubmited: dashboardStats?.quizzesAttempted || 0,
        averageScore: dashboardStats?.averageScore || 0,
        address: propUserData.address || "",
        dob: propUserData.dob || "",
        username: propUserData.username || "",
      });
      
      // Always update profile image state, even if null
      setProfileImg(propUserData.avatarUrl || null);
    }
  }, [propUserData, dashboardStats]);
  // Handle form submission for profile updates
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const profileData = {
        fullName: userData.name,
        phone: userData.number,
        address: userData.address,
        dateOfBirth: userData.dob,
      };
      
      const response = await userAPI.updateProfile(profileData);
      if (response.success) {
        seteditable(false);
        
        // Refresh dashboard data to update profile across all components
        if (refreshUserData) {
          refreshUserData();
        }
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile. Please try again.');
    }
  };

  if (propLoading) {
    return (
      <div className="h-auto w-full flex flex-col content-center pt-20 px-5">
        <div className="flex justify-center items-center h-64">
          <div className="text-xl text-gray-600 dark:text-gray-300">Loading profile...</div>
        </div>
      </div>
    );
  }

  if (propError) {
    return (
      <div className="h-auto w-full flex flex-col content-center pt-20 px-5">
        <div className="flex justify-center items-center h-64">
          <div className="text-xl text-red-600 dark:text-red-400">{propError}</div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="h-auto w-full flex flex-col content-center pt-20 px-5">
        <div className="flex justify-center items-center h-64">
          <div className="text-xl text-red-600 dark:text-red-400">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="h-auto w-full flex flex-col content-center pt-4 lg:pt-10 px-2 sm:px-5">
        {/* Mobile joined date - shown only on mobile */}
        <div className="flex lg:hidden flex-row justify-center sm:justify-end items-center text-gray-600 dark:text-gray-300 py-2 mb-4">
          <FontAwesomeIcon icon={faCalendarDays} />
          <p className="px-3">Joined {userData.joined}</p>
        </div>
        
        {/* Profile Picture Section */}
        <div className="flex flex-col items-center justify-center mb-4 relative">
          {/* Full width horizontal lines - desktop only */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gray-300 dark:bg-gray-600 transform -translate-y-15 z-0"></div>
          
          {/* Profile Picture with horizontal line */}
          <div className="relative flex-shrink-0">
            
            <div className="p-2 w-fit bg-white dark:bg-gray-800 rounded-full group shadow-lg relative z-10">
              <div className="hoverelement absolute inset-0 rounded-full place-items-center bg-[#0909097d] backdrop-opacity-5 hidden group-hover:grid z-20">
                <form action="" method="post" className="h-full w-full rounded-full grid place-items-center">
                  <input
                    type="file"
                    name="profile"
                    id="profile"
                    accept="[images/*]"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  <label htmlFor="profile" className="w-full h-full cursor-pointer grid place-items-center">
                    <FontAwesomeIcon
                      icon={faPencil}
                      className="text-white text-3xl sm:text-4xl lg:text-5xl cursor-pointer"
                    />
                  </label>
                </form>
              </div>
              <div className="w-20 h-20 sm:w-28 sm:h-28 lg:w-36 lg:h-36 xl:w-40 xl:h-40 rounded-full grid place-items-center bg-gray-800 z-10 overflow-hidden">
                {profileImg && (
                  <img
                    src={profileImg}
                    alt="Profile"
                    className="rounded-full w-full h-full object-cover"
                  />
                )}
                {!profileImg && (
                  <FontAwesomeIcon
                    icon={faUserTie}
                    className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl text-white"
                  />
                )}
              </div>
            </div>
          </div>
          
          {/* User Info - Centered below profile picture */}
          <div className="text-center">
            <h2 className="font-semibold text-lg sm:text-xl lg:text-2xl xl:text-3xl text-gray-800 dark:text-white mb-1 lg:mb-2">
              {userData.name}
            </h2>
            <h3 className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm lg:text-base xl:text-lg mb-2 lg:mb-3">
              {userData.email}
            </h3>
            
            {/* Desktop joined date - centered below email */}
            <div className="hidden lg:flex flex-row items-center justify-center text-gray-600 dark:text-gray-300 text-sm xl:text-base">
              <FontAwesomeIcon icon={faCalendarDays} className="mr-2" />
              <p>Joined {userData.joined}</p>
            </div>
          </div>
        </div>
        
        {/* Divider */}
        <div className="w-full mb-6 lg:mb-8">
          <hr className="border-gray-300 dark:border-gray-600" />
        </div>
        <div className="px-2 sm:px-10 flex flex-col sm:flex-row justify-around gap-4 sm:gap-0 mb-2 border-b-2 pb-5 border-gray-200 dark:border-gray-600">
          <button className="p-3 sm:p-4 bg-indigo-600 dark:bg-indigo-500 text-white font-semibold text-sm sm:text-xl rounded-2xl flex flex-row gap-x-2 sm:gap-x-5 items-center hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors min-h-[48px] justify-center">
            <FontAwesomeIcon icon={faPenFancy} />
            <p>Quizzes Created</p>
            <p>{userData.quizCreated}</p>
          </button>
          <button className="p-3 sm:p-4 bg-green-600 dark:bg-green-500 text-white font-semibold text-sm sm:text-xl rounded-2xl flex flex-row gap-x-2 sm:gap-x-5 items-center hover:bg-green-700 dark:hover:bg-green-600 transition-colors min-h-[48px] justify-center">
            <FontAwesomeIcon icon={faStar} />
            <p>Average Score</p>
            <p>{userData.averageScore}%</p>
          </button>
          <button className="p-3 sm:p-4 bg-indigo-600 dark:bg-indigo-500 text-white font-semibold text-sm sm:text-xl rounded-2xl flex flex-row gap-x-2 sm:gap-x-5 items-center hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors min-h-[48px] justify-center">
            <FontAwesomeIcon icon={faCircleCheck} />
            <p>Quizzes Submited</p>
            <p>{userData.quiSubmited}</p>
          </button>
        </div>
        <div className="p-2 sm:p-4">
          <h2 className="text-gray-500 dark:text-gray-400 mb-4 text-lg font-medium">Account Details</h2>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6"
          >
            {[
              {
                label: "Name",
                type: "text",
                id: "name",
                name: "name",
                value: userData.name,
                colSpan: 1,
              },
              {
                label: "User Name",
                type: "text",
                id: "username",
                name: "username",
                value: userData.username,
                colSpan: 1,
              },
              {
                label: "Email",
                type: "email",
                id: "email",
                name: "email",
                value: userData.email,
                colSpan: 1,
              },
              {
                label: "DOB",
                type: "date",
                id: "dob",
                name: "dob",
                value: userData.dob,
                colSpan: 1,
              },
              {
                label: "Number",
                type: "number",
                id: "number",
                name: "number",
                value: userData.number,
                colSpan: 1,
              },
              {
                label: "Password",
                type: "password",
                id: "password",
                name: "password",
                value: userData.password,
                colSpan: 1,
              },
              {
                label: "Address",
                type: "text",
                id: "address",
                name: "address",
                value: userData.address,
                colSpan: 2,
              },
            ].map((field, idx) => (
              <div
                key={field.id}
                className={`w-full h-fit rounded-xl border transition-all duration-300 ${
                  field.colSpan === 2 ? "lg:col-span-2" : ""
                } ${
                  editable
                    ? "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 shadow-sm hover:shadow-md"
                    : "bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                }`}
              >
                <div className="p-4">
                  <label
                    htmlFor={field.id}
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    {field.label}
                  </label>
                  <input
                    className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-transparent text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200 min-h-[48px]"
                    type={field.type}
                    id={field.id}
                    name={field.name}
                    value={field.value}
                    disabled={!editable}
                    onChange={(e) => {
                      setUserData((prev) => ({
                        ...prev,
                        [field.id]: e.target.value,
                      }));
                    }}
                  />
                </div>
              </div>
            ))}
            <div className="lg:col-span-2 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-end mt-4">
              <button
                type="submit"
                className={`px-6 py-3 bg-green-500 dark:bg-green-600 text-white font-semibold rounded-xl hover:bg-green-600 dark:hover:bg-green-700 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg min-h-[48px] flex items-center justify-center gap-2 ${
                  editable ? "flex" : "hidden"
                }`}
              >
                <FontAwesomeIcon icon={faCircleCheck} />
                Submit Changes
              </button>
              <button
                className={`px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg min-h-[48px] flex items-center justify-center gap-2 ${
                  !editable ? "flex" : "hidden"
                }`}
                type="button"
                onClick={() => {
                  seteditable(true);
                }}
              >
                <FontAwesomeIcon icon={faPencil} />
                Edit Details
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};