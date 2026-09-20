import React from "react";
import { Parallax, ParallaxLayer } from "@react-spring/parallax";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFilePdf,
  faTerminal,
  faVideo,
  faGaugeHigh,
  faUsers,
  faShieldHalved,
  faChalkboardUser,
  faPencilRuler,
  faBriefcase,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

export const Home = () => {
  const navigate = useNavigate();

  return (
    // Main container with a light background
    <div className="min-h-screen transition-all duration-150 bg-gradient-to-b from-slate-100 to-slate-300 dark:from-gray-900 dark:to-gray-950">
      {/* Mobile Static Layout */}
      <div className="block md:hidden">
        {/* Hero Section */}
        <section className="min-h-screen flex flex-col justify-center items-center text-center px-4 bg-gradient-to-b from-slate-200 to-slate-100 dark:from-gray-950 dark:to-gray-900 shadow-[0_-15px_25px_-10px_rgba(0,0,0,0.1)]">
          <div className="flex flex-col items-center justify-center space-y-4 mt-[10vh]">
            <h1 className="quicksand-normal text-slate-800 dark:text-white text-4xl sm:text-5xl leading-tight">
              Welcome to
            </h1>
            <h1 className="quicksand-normal text-slate-800 dark:text-white text-3xl sm:text-4xl leading-tight">
              Quizz Craft
            </h1>
          </div>
          <div className="flex flex-col items-center space-y-6 mt-8">
            <img
              src="/op.png"
              alt="Wise owl mascot"
              className="w-auto h-[25vh] sm:h-[30vh]"
            />
            <button
              type="button"
              className="text-white z-10 py-3 px-6 sm:px-8 font-bold rounded-full cursor-pointer bg-red-600 hover:bg-[#ae2929] transition-all duration-300 transform hover:scale-105 text-sm sm:text-base min-h-[48px] shadow-lg hover:shadow-xl"
              onClick={() => navigate("/MakeQuiz")}
            >
              Generate Quiz
            </button>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="min-h-screen flex flex-col justify-center items-center text-center bg-gradient-to-t from-slate-900 to-slate-800 dark:from-black dark:to-gray-900 px-4">
          <div className="flex flex-col items-center space-y-6 pt-[10vh]">
            <h2 className="quicksand-normal text-3xl sm:text-4xl text-slate-300 dark:text-white">
              How It Works?
            </h2>
            <p className="text-red-600 dark:text-red-400 text-sm sm:text-base">
              Unleash the Power of PDFs in Quiz Building!
            </p>
          </div>
          <div className="mt-8">
            <FeatureCards />
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="min-h-screen flex flex-col justify-center items-center text-center p-4 bg-gradient-to-b from-slate-200 to-slate-100 dark:from-gray-950 dark:to-gray-900 shadow-[0_-15px_25px_-10px_rgba(0,0,0,0.1)]">
          <div className="flex flex-col items-center space-y-6 pt-[10vh]">
            <h2 className="quicksand-normal text-3xl sm:text-4xl text-gray-800 dark:text-white mb-6">
              Ready to Begin?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base max-w-2xl mb-6 px-4">
              Join thousands of educators and learners who use Quizz Craft to create engaging and effective learning experiences.
            </p>
            <div className="flex flex-col gap-3 w-full max-w-md">
              <button
                type="button"
                className="text-white text-sm sm:text-base z-10 py-3 px-6 font-bold rounded-full cursor-pointer bg-red-600 hover:bg-[#ae2929] transition-all duration-300 transform hover:scale-105 min-h-[48px] shadow-lg hover:shadow-xl"
                onClick={() => navigate("/MakeQuiz")}
              >
                Make a Quiz
              </button>
              <button
                type="button"
                className="text-gray-800 dark:text-white border-gray-800 dark:border-white text-sm sm:text-base z-10 py-3 px-6 font-bold rounded-full cursor-pointer bg-transparent border-2 hover:bg-gray-800 dark:hover:bg-white hover:text-white dark:hover:text-gray-900 transition-all duration-300 transform hover:scale-105 min-h-[48px] shadow-lg hover:shadow-xl"
                onClick={() => navigate("/JoinQuiz")}
              >
                Join a Quiz
              </button>
            </div>
          </div>
        </section>

        {/* Why Choose Section */}
        <section className="min-h-screen flex flex-col justify-center items-center text-center p-4 bg-gradient-to-t from-slate-900 to-slate-800 dark:from-black dark:to-gray-900">
          <div className="flex flex-col items-center space-y-6 pt-[10vh]">
            <h2 className="quicksand-normal text-3xl sm:text-4xl text-slate-300 dark:text-white mb-6">
              Why Choose Quizz Craft?
            </h2>
          </div>
          <div className="mt-8">
            <WhyChooseCards />
          </div>
        </section>

        {/* Benefit Section */}
        <section className="min-h-screen flex flex-col justify-center items-center text-center p-4 bg-gradient-to-b from-slate-100 to-slate-200 dark:from-gray-950 dark:to-gray-900 shadow-[0_-15px_25px_-10px_rgba(0,0,0,0.1)]">
          <div className="flex flex-col items-center space-y-6 pt-[10vh]">
            <h2 className="quicksand-normal text-2xl sm:text-3xl text-slate-800 dark:text-white mb-6">
              Who Can Benefit?
            </h2>
          </div>
          <div className="mt-8">
            <BenefitCards />
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="min-h-screen flex flex-col justify-center items-center text-center p-4 bg-gradient-to-t from-slate-900 to-slate-800 dark:from-black dark:to-gray-900">
          <div className="flex flex-col items-center space-y-6 pt-[10vh]">
            <h2 className="quicksand-normal text-2xl sm:text-3xl text-white mb-4">
              Join the Quiz Revolution Today!
            </h2>
            <p className="text-indigo-200 dark:text-indigo-300 text-sm sm:text-base max-w-3xl mb-6 px-4">
              Elevate your content, engage your audience, and save valuable time.
            </p>
            <button
              type="button"
              onClick={() => navigate("/MakeQuiz")}
              className="text-white text-sm sm:text-base z-10 py-3 px-6 font-bold rounded-lg cursor-pointer bg-red-600 hover:bg-[#ae2929] transition-all duration-300 transform hover:scale-105 min-h-[48px] shadow-lg hover:shadow-xl"
            >
              Get Started Now
            </button>
            <p className="text-indigo-300 text-xs sm:text-sm absolute bottom-2 sm:bottom-4">
              © 2025 Quizz Craft
            </p>
          </div>
        </section>
      </div>

      {/* Desktop Parallax Layout */}
      <div className="hidden md:block overflow-hidden">
        <Parallax pages={6} className="top-0 left-0 w-full h-full [&::-webkit-scrollbar]:hidden" style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
          {/* 🔷 Layer 0 — Titles */}
          <ParallaxLayer
            offset={0}
            speed={0.9}
            className="absolute flex flex-col justify-center items-center text-center min-h-screen px-4 bg-gradient-to-b from-slate-200 to-slate-100 dark:from-gray-950 dark:to-gray-900 shadow-[0_-15px_25px_-10px_rgba(0,0,0,0.1)]"
          >
            <div className="flex flex-col items-center justify-center space-y-4 translate-y-[-15vh]">
              <h1 className="quicksand-normal text-slate-800 dark:text-white text-7xl lg:text-8xl xl:text-9xl leading-tight">
                Welcome to
              </h1>
              <h1 className="quicksand-normal text-slate-800 dark:text-white text-6xl lg:text-7xl xl:text-8xl leading-tight">
                Quizz Craft
              </h1>
            </div>
          </ParallaxLayer>

          {/* 🖼️ Owl + Button */}
          <ParallaxLayer
            offset={0}
            speed={1.2}
            className="absolute flex flex-col items-center justify-end text-center pb-8 sm:pb-12 px-4"
          >
            <div className="flex flex-col items-center space-y-6">
              <img
                src="/op.png"
                alt="Wise owl mascot"
                className="w-auto h-[25vh] sm:h-[30vh] md:h-[35vh] lg:h-[40vh]"
              />
              <button
                type="button"
                className="text-white z-10 py-3 px-6 sm:px-8 lg:px-10 font-bold rounded-full cursor-pointer bg-red-600 hover:bg-[#ae2929] transition-all duration-300 transform hover:scale-105 text-sm sm:text-base lg:text-lg min-h-[48px] shadow-lg hover:shadow-xl"
                onClick={() => navigate("/MakeQuiz")}
              >
                Generate Quiz
              </button>
            </div>
          </ParallaxLayer>

          {/* ❓ How It Works */}
          <ParallaxLayer
            offset={1}
            speed={0.8}
            className="flex justify-center items-center text-center bg-gradient-to-t from-slate-900 to-slate-800 dark:from-black dark:to-gray-900 px-4 min-h-screen"
          >
            <div className="flex flex-col items-center space-y-6 pt-[10vh]">
              <h2 className="quicksand-normal text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-slate-300 dark:text-white">
                How It Works?
              </h2>
              <p className="text-red-600 dark:text-red-400 text-sm sm:text-base lg:text-lg">
                Unleash the Power of PDFs in Quiz Building!
              </p>
            </div>
          </ParallaxLayer>

          {/* 🧠 Feature Cards */}
          <ParallaxLayer offset={1.4} speed={1.2} className="flex justify-center items-center px-4">
            <FeatureCards />
          </ParallaxLayer>

          {/* 🚀 Call to Action */}
          <ParallaxLayer
            offset={2}
            speed={0.8}
            className="flex flex-col items-center justify-center text-center p-4 bg-gradient-to-b from-slate-200 to-slate-100 dark:from-gray-950 dark:to-gray-900 shadow-[0_-15px_25px_-10px_rgba(0,0,0,0.1)] min-h-screen"
          >
            <div className="flex flex-col items-center space-y-6 pt-[10vh]">
              <h2 className="quicksand-normal text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-gray-800 dark:text-white mb-6 sm:mb-8">
                Ready to Begin?
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base md:text-lg lg:text-xl max-w-2xl mb-6 sm:mb-8 px-4">
                Join thousands of educators and learners who use Quizz Craft to create engaging and effective learning experiences.
              </p>
              <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4 w-full max-w-md sm:max-w-none">
                <button
                  type="button"
                  className="text-white text-sm sm:text-base lg:text-lg z-10 py-3 px-6 sm:px-8 font-bold rounded-full cursor-pointer bg-red-600 hover:bg-[#ae2929] transition-all duration-300 transform hover:scale-105 min-h-[48px] shadow-lg hover:shadow-xl"
                  onClick={() => navigate("/MakeQuiz")}
                >
                  Make a Quiz
                </button>
                <button
                  type="button"
                  className="text-gray-800 dark:text-white border-gray-800 dark:border-white text-sm sm:text-base lg:text-lg z-10 py-3 px-6 sm:px-8 font-bold rounded-full cursor-pointer bg-transparent border-2 hover:bg-gray-800 dark:hover:bg-white hover:text-white dark:hover:text-gray-900 transition-all duration-300 transform hover:scale-105 min-h-[48px] shadow-lg hover:shadow-xl"
                  onClick={() => navigate("/JoinQuiz")}
                >
                  Join a Quiz
                </button>
              </div>
            </div>
          </ParallaxLayer>

          {/* 🧐 Why Choose Section */}
          <ParallaxLayer
            offset={3}
            speed={0.8}
            className="flex flex-col items-center justify-center text-center p-4 bg-gradient-to-t from-slate-900 to-slate-800 dark:from-black dark:to-gray-900 min-h-screen"
          >
            <div className="flex flex-col items-center space-y-6 pt-[10vh]">
              <h2 className="quicksand-normal text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-slate-300 dark:text-white mb-6 sm:mb-8">
                Why Choose Quizz Craft?
              </h2>
            </div>
          </ParallaxLayer>

          <ParallaxLayer offset={3.4} speed={1.2} className="flex justify-center items-center px-4">
            <WhyChooseCards />
          </ParallaxLayer>

          {/* 📚 Benefit Section */}
          <ParallaxLayer
            offset={4}
            speed={0.2}
            className="bg-gradient-to-b from-slate-100 to-slate-200 dark:from-gray-950 dark:to-gray-900 shadow-[0_-15px_25px_-10px_rgba(0,0,0,0.1)] min-h-screen"
          />
          <ParallaxLayer
            offset={4}
            speed={0.8}
            className="flex flex-col items-center justify-center text-center p-4 min-h-screen"
          >
            <div className="flex flex-col items-center space-y-6 pt-[10vh]">
              <h2 className="quicksand-normal text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-slate-800 dark:text-white mb-6 sm:mb-8">
                Who Can Benefit?
              </h2>
            </div>
          </ParallaxLayer>
          <ParallaxLayer offset={4.4} speed={1.2} className="flex justify-center items-center px-4">
            <BenefitCards />
          </ParallaxLayer>

          {/* 🎉 Final CTA */}
          <ParallaxLayer
            offset={5}
            speed={0.5}
            className="bg-gradient-to-t from-slate-900 to-slate-800 dark:from-black dark:to-gray-900 flex flex-col items-center justify-center text-center p-4 min-h-screen"
          >
            <div className="flex flex-col items-center space-y-6 pt-[10vh]">
              <h2 className="quicksand-normal text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white mb-4">
                Join the Quiz Revolution Today!
              </h2>
              <p className="text-indigo-200 dark:text-indigo-300 text-sm sm:text-base md:text-lg max-w-3xl mb-6 sm:mb-8 px-4">
                Elevate your content, engage your audience, and save valuable time.
              </p>
              <button
                type="button"
                onClick={() => navigate("/MakeQuiz")}
                className="text-white text-sm sm:text-base lg:text-lg z-10 py-3 px-6 sm:px-8 lg:px-10 font-bold rounded-lg cursor-pointer bg-red-600 hover:bg-[#ae2929] transition-all duration-300 transform hover:scale-105 min-h-[48px] shadow-lg hover:shadow-xl"
              >
                Get Started Now
              </button>
              <p className="text-indigo-300 text-xs sm:text-sm absolute bottom-2 sm:bottom-4">
                © 2025 Quizz Craft
              </p>
            </div>
          </ParallaxLayer>
        </Parallax>
      </div>
    </div>
  );
};

// FeatureCards component remains the same
// 🧠 Feature Cards
const FeatureCards = () => {
  const navigate = useNavigate();
  const features = [
    {
      title: "Upload Your PDF:",
      icon: faFilePdf,
      description:
        "Simply upload your PDF document containing questions and answers. Our intelligent system will analyze the content and extract the quiz elements automatically.",
    },
    {
      title: "Customize Your Quiz:",
      icon: faTerminal,
      description:
        "Once the extraction is complete, you have the flexibility to customize your quiz, edit new ones, adjust difficulty levels, and make it uniquely yours.",
    },
    {
      title: "Generate Instantly:",
      icon: faVideo,
      description:
        "No more waiting! With a click of a button, generate your quiz in seconds. Share it with your audience, students, or colleagues effortlessly.",
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row gap-6 lg:gap-8 justify-center items-stretch px-4 sm:px-6">
      {features.map((feature, index) => (
        <button
          key={index}
          onClick={() => navigate("/MakeQuiz")}
          className="bg-white dark:bg-gray-800 text-slate-800 dark:text-white p-4 sm:p-6 rounded-2xl w-full lg:w-1/3 min-h-[280px] sm:min-h-[320px] flex flex-col items-center text-center gap-3 sm:gap-4 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group hover:scale-105 cursor-pointer relative overflow-hidden"
        >
          <FontAwesomeIcon
            icon={feature.icon}
            className="text-4xl sm:text-5xl mb-2 text-[#f73e00] group-hover:text-white transition-colors duration-300"
          />
          <h3 className="text-lg sm:text-xl lg:text-2xl font-bold quicksand-normal group-hover:text-white transition-colors duration-300">
            {feature.title}
          </h3>
          <p className="text-sm sm:text-base text-slate-600 dark:text-gray-300 group-hover:text-slate-100 transition-colors duration-300 leading-relaxed">
            {feature.description}
          </p>
          <div className="absolute inset-0 bg-gradient-to-br from-[#f73e00] to-[#ae2929] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
        </button>
      ))}
    </div>
  );
};

// 🚀 Why Choose Cards
const WhyChooseCards = () => (
  <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row gap-6 lg:gap-8 justify-center items-stretch px-4 sm:px-6">
    {[
      {
        title: "Versatility:",
        icon: faGaugeHigh,
        desc: "Accept quizzes in various formats, making it easy to integrate with your existing materials.",
      },
      {
        title: "User-Friendly Interface:",
        icon: faUsers,
        desc: "Our intuitive interface ensures a smooth experience, even for first-time users.",
      },
      {
        title: "Secure and Reliable:",
        icon: faShieldHalved,
        desc: "Rest assured, your data is handled with the utmost care. We prioritize security to protect your content and privacy.",
      },
    ].map((card, idx) => (
      <div
        key={idx}
        className="bg-white dark:bg-gray-800 text-slate-800 dark:text-white p-4 sm:p-6 rounded-2xl w-full lg:w-1/3 min-h-[280px] sm:min-h-[320px] flex flex-col items-center text-center gap-3 sm:gap-4 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group hover:scale-105 relative overflow-hidden"
      >
        <FontAwesomeIcon icon={card.icon} className="text-4xl sm:text-5xl mb-2 text-[#f73e00] group-hover:scale-110 transition-transform duration-300" />
        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold quicksand-normal">{card.title}</h3>
        <p className="text-sm sm:text-base text-slate-600 dark:text-gray-300 leading-relaxed">{card.desc}</p>
      </div>
    ))}
  </div>
);

// 🎓 Benefit Cards
const BenefitCards = () => (
  <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row gap-6 lg:gap-8 justify-center items-stretch px-4 sm:px-6">
    {[
      {
        title: "Educators:",
        icon: faChalkboardUser,
        desc: "Quickly generate quizzes for your students and focus on what matters – teaching.",
      },
      {
        title: "Content Creators:",
        icon: faPencilRuler,
        desc: "Enhance your courses and materials with engaging quizzes without the hassle.",
      },
      {
        title: "Business Professionals:",
        icon: faBriefcase,
        desc: "Streamline training sessions by creating quizzes from your PDF presentations.",
      },
    ].map((card, idx) => (
      <div
        key={idx}
        className="bg-white dark:bg-gray-800 text-slate-800 dark:text-white p-4 sm:p-6 rounded-2xl w-full lg:w-1/3 min-h-[280px] sm:min-h-[320px] flex flex-col items-center text-center gap-3 sm:gap-4 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group hover:scale-105 relative overflow-hidden"
      >
        <FontAwesomeIcon icon={card.icon} className="text-4xl sm:text-5xl mb-2 text-[#f73e00] group-hover:scale-110 transition-transform duration-300" />
        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold quicksand-normal">{card.title}</h3>
        <p className="text-sm sm:text-base text-slate-600 dark:text-gray-300 leading-relaxed">{card.desc}</p>
      </div>
    ))}
  </div>
);
