import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTheme } from "./Components/ThemeContext";
import { useAuth } from "./contexts/AuthContext";
import { userAPI, quizAPI, attemptAPI } from "./utils/api";
import { notifications } from "./dump/notifications.jsx" ;
import { settings } from "./dump/settings.jsx" ;
import {
  faGear,
  faBell,
  faCalendarDays,
  faUserTie,
  faPenFancy,
  faCircleCheck,
  faStar,
  faPencil,
  faBars,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { faIdBadge } from "@fortawesome/free-regular-svg-icons";
import { Profile } from './Components/Profile.jsx'
import { QuizCreated } from './Components/QuizCreated.jsx';
import { QuizAttempted } from './Components/QuizAttempted.jsx';
import { Notifications } from './Components/Notifications.jsx';
import { Settings } from './Components/Settings.jsx';

export const Dashboard = () => {
  const [Isactive, setisactive] = useState("Profile");
  const [setting, setSettings] = useState(settings);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { darkMode } = useTheme();
  const { user } = useAuth();
  
  // Centralized user data state
  const [userData, setUserData] = useState({
    name: "",
    joined: "",
    email: "",
    number: "",
    password: "",
    address: "",
    dob: "",
    username: "",
    avatarUrl: null
  });
  
  const [dashboardStats, setDashboardStats] = useState({
    quizzesCreated: 0,
    quizzesAttempted: 0,
    averageScore: 0
  });
  
  const [quizzesData, setQuizzesData] = useState([]);
  const [attemptsData, setAttemptsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const handleSettingChange = (settingId) => {
    setSettings((prev) =>
      prev.map((setting) =>
        setting.id === settingId
          ? { ...setting, enabled: !setting.enabled }
          : setting
      )
    );
  };
  
  // Centralized data fetching
  useEffect(() => {
    const fetchAllUserData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Fetch user profile data
        const userResponse = await userAPI.getCurrentUser();
        
        // Fetch user avatar
        let avatarResponse = null;
        try {
          avatarResponse = await userAPI.getAvatar();
        } catch (avatarError) {
          console.log('Dashboard - Avatar fetch failed:', avatarError);
        }
        
        // Fetch user's created quizzes
        const quizzesResponse = await quizAPI.getQuizById();
        
        // Fetch user's attempt history
        const attemptsResponse = await attemptAPI.getAttemptHistory();
        
        if (userResponse.success && userResponse.data) {
          const userData = userResponse.data.user || userResponse.data;
          
          // Process avatar URL
          let avatarUrl = null;
          if (avatarResponse && avatarResponse.success && avatarResponse.data) {
            // Check for avatarUrl first, then fallback to profilePicture
            const rawAvatarUrl = avatarResponse.data.avatarUrl || avatarResponse.data.profilePicture;
            
            if (rawAvatarUrl) {
              avatarUrl = rawAvatarUrl.startsWith('http') 
                ? rawAvatarUrl 
                : `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}${rawAvatarUrl}`;
            }
          }
          
          // Process quizzes data
          const quizzes = quizzesResponse.success && quizzesResponse.data && quizzesResponse.data.quizzes 
            ? quizzesResponse.data.quizzes 
            : [];
          
          // Process attempts data
          const attempts = attemptsResponse.success && attemptsResponse.data && attemptsResponse.data.attempts 
            ? attemptsResponse.data.attempts 
            : [];
          
          // Calculate statistics
          const quizzesCreated = quizzes.length;
          const quizzesAttempted = attempts.length;
          
          let averageScore = 0;
          if (attempts.length > 0) {
            const totalScore = attempts.reduce((sum, attempt) => sum + (attempt.score || 0), 0);
            averageScore = Math.round(totalScore / attempts.length);
          }
          
          // Format join date
          const joinDate = userData.createdAt ? new Date(userData.createdAt).toLocaleDateString('en-US', { 
            month: 'long', 
            year: 'numeric' 
          }) : 'Recently';
          
          // Update all states
          setUserData({
            name: userData.fullName || userData.name || userData.username || '',
            joined: joinDate,
            email: userData.email || '',
            number: userData.phone || userData.phoneNumber || userData.mobileNo || '',
            password: '••••••••',
            address: userData.address || '',
            dob: userData.dateOfBirth || userData.dob || '',
            username: userData.username || '',
            avatarUrl: avatarUrl
          });
          
          setDashboardStats({
            quizzesCreated,
            quizzesAttempted,
            averageScore
          });
          
          setQuizzesData(quizzes);
          setAttemptsData(attempts);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAllUserData();
  }, [user]);
  
  // Function to refresh data (can be passed to child components)
  const refreshUserData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Re-fetch all data
      const [userResponse, avatarResponse, quizzesResponse, attemptsResponse] = await Promise.allSettled([
        userAPI.getCurrentUser(),
        userAPI.getAvatar().catch(() => null),
        quizAPI.getQuizById(),
        attemptAPI.getAttemptHistory()
      ]);
      
      // Process responses similar to above
      if (userResponse.status === 'fulfilled' && userResponse.value.success) {
        const userData = userResponse.value.data.user || userResponse.value.data;
        
        let avatarUrl = null;
        if (avatarResponse.status === 'fulfilled' && avatarResponse.value && avatarResponse.value.success) {
          const avatarData = avatarResponse.value.data;
          if (avatarData && avatarData.avatarUrl) {
            avatarUrl = avatarData.avatarUrl.startsWith('http') 
              ? avatarData.avatarUrl 
              : `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}${avatarData.avatarUrl}`;
          }
        }
        
        const quizzes = quizzesResponse.status === 'fulfilled' && quizzesResponse.value.success && quizzesResponse.value.data && quizzesResponse.value.data.quizzes 
          ? quizzesResponse.value.data.quizzes 
          : [];
        
        const attempts = attemptsResponse.status === 'fulfilled' && attemptsResponse.value.success && attemptsResponse.value.data && attemptsResponse.value.data.attempts 
          ? attemptsResponse.value.data.attempts 
          : [];
        
        const quizzesCreated = quizzes.length;
        const quizzesAttempted = attempts.length;
        
        let averageScore = 0;
        if (attempts.length > 0) {
          const totalScore = attempts.reduce((sum, attempt) => sum + (attempt.score || 0), 0);
          averageScore = Math.round(totalScore / attempts.length);
        }
        
        setUserData(prev => ({
          ...prev,
          avatarUrl: avatarUrl
        }));
        
        setDashboardStats({
          quizzesCreated,
          quizzesAttempted,
          averageScore
        });
        
        setQuizzesData(quizzes);
        setAttemptsData(attempts);
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-80px)] w-full bg-gray-50 dark:bg-gray-900 transition-colors duration-300 flex flex-col overflow-hidden">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center flex-shrink-0">
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">Dashboard</h1>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
        >
          <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} />
        </button>
      </div>

      <div className="flex flex-1 lg:grid lg:grid-cols-[300px_1fr] overflow-hidden">
        {/* Mobile Sidebar Overlay */}
        {isMobileMenuOpen && (
          <div 
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
        
        {/* Sidebar */}
        <div className={`
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 fixed lg:relative top-0 left-0 z-50 lg:z-auto
          w-80 lg:w-full h-full lg:h-full
          bg-white dark:bg-gray-800 
          border-r-2 border-gray-200 dark:border-gray-700 
          transition-all duration-300 ease-in-out
          lg:transition-colors lg:duration-300
          overflow-y-auto lg:overflow-hidden
          flex-shrink-0
        `}>
          <LeftPanel 
            isactive={Isactive} 
            setisactive={setisactive} 
            setIsMobileMenuOpen={setIsMobileMenuOpen}
          />
        </div>
        
        {/* Main Content */}
        <div className="flex-1 bg-gray-50 dark:bg-gray-900 overflow-y-auto transition-colors duration-300 min-h-0">
          {Isactive === "Profile" && (
            <Profile 
              userData={userData}
              dashboardStats={dashboardStats}
              loading={loading}
              error={error}
              refreshUserData={refreshUserData}
            />
          )}
          {Isactive === "Quiz Created" && (
            <QuizCreated 
              quizzesCreated={quizzesData}
              loading={loading}
              error={error}
            />
          )}
          {Isactive === "Quiz Attempted" && (
            <QuizAttempted 
              quizAttempted={attemptsData}
              loading={loading}
              error={error}
            />
          )}
          {Isactive === "Notification" && <Notifications notifications = {notifications}/>}
          {Isactive === "Settings" && <Settings settings = {setting} onChange={handleSettingChange}/>}
        </div>
      </div>
    </div>
  );
};
const LeftPanel = ({ isactive, setisactive, setIsMobileMenuOpen }) => {
  return (
    <>
      <div className="px-5 py-2">
        {[
          [
            "Management",
            [
              ["Profile", faIdBadge],
              ["Quiz Created", faPenFancy],
              ["Quiz Attempted", faCircleCheck],
            ],
          ],
          [
            "User",
            [
              ["Notification", faBell],
              ["Settings", faGear],
            ],
          ],
        ].map((props, index) => {
          const isLast = index === 1; // since there are only two main sections
          return (
            <div key={index}>
              <h2 className="text-sm text-gray-500 dark:text-gray-400 mb-2 transition-colors duration-300">{props[0]}</h2>
              <div
                className={`w-full grid grid-rows-subgrid px-2 py-2 gap-3 pb-5 mb-5${
                  !isLast ? " border-b-2 border-gray-200 dark:border-gray-600" : ""
                } transition-colors duration-300`} key={index}
              >
                {props[1].map((name, idx) => {
                  return (
                    <span
                      className={`${
                        isactive === name[0]
                          ? "bg-indigo-600 dark:bg-indigo-500 text-white font-bold shadow-lg"
                          : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-white"
                      } px-4 py-2 rounded-2xl flex gap-3 items-center cursor-pointer transition-all duration-300 min-h-[48px]`}
                      onClick={() => {
                        setisactive(name[0]);
                        // Close mobile menu when item is selected
                        if (setIsMobileMenuOpen) {
                          setIsMobileMenuOpen(false);
                        }
                      }}
                      key={idx}
                    >
                      <FontAwesomeIcon icon={name[1]} />
                      <p>{name[0]}</p>
                    </span>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};
