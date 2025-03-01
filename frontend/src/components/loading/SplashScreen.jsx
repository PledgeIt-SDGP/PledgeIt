import React, { useEffect, useState } from "react";
import { Heart, Gift, Award, Star, Rocket } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SplashScreen = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Progress animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 4;
      });
    }, 100);

    // Navigate after showing splash
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        navigate("/home");
      }, 1000);
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, [navigate]);

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-1000 antialiased ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      style={{ backgroundColor: "#ffffff" }}
    >
      {/* Floating icons in the background */}
      <div className="absolute inset-0">
        {/* Existing Icons */}
        {/* Top Left */}
        <Heart 
          className="absolute text-red-700" 
          style={{ top: "5%", left: "5%", animation: "float 3s ease-in-out infinite" }}
          size={28}
        />
        {/* Top Right */}
        <Gift 
          className="absolute text-pink-300" 
          style={{ top: "5%", right: "5%", animation: "float 4s ease-in-out infinite 0.5s" }}
          size={24}
        />
        {/* Bottom Left */}
        <Award 
          className="absolute text-yellow-400" 
          style={{ bottom: "5%", left: "5%", animation: "float 3.5s ease-in-out infinite 1s" }}
          size={32}
        />
        {/* Bottom Right */}
        <Star 
          className="absolute text-yellow-500" 
          style={{ bottom: "5%", right: "5%", animation: "float 2.5s ease-in-out infinite 0.7s" }}
          size={28}
        />
        {/* Mid Left */}
        <Rocket 
          className="absolute text-blue-400" 
          style={{ left: "2%", top: "50%", transform: "translateY(-50%)", animation: "float 3.2s ease-in-out infinite 1.2s" }}
          size={26}
        />
        {/* Mid Right */}
        <Heart 
          className="absolute text-red-700" 
          style={{ right: "2%", top: "50%", transform: "translateY(-50%)", animation: "float 3.4s ease-in-out infinite 0.8s" }}
          size={28}
        />
        {/* Additional icons for balanced fill */}
        <Gift 
          className="absolute text-pink-300" 
          style={{ top: "25%", left: "2%", animation: "float 3.8s ease-in-out infinite 0.3s" }}
          size={24}
        />
        <Award 
          className="absolute text-yellow-400" 
          style={{ bottom: "25%", right: "2%", animation: "float 3.6s ease-in-out infinite 1.3s" }}
          size={32}
        />

        {/* Extra Icons on the Left Side (evenly spaced) */}
        <Star 
          className="absolute text-yellow-500" 
          style={{ left: "0%", top: "15%", animation: "float 4s ease-in-out infinite 0.9s" }}
          size={26}
        />
        <Heart 
          className="absolute text-red-700" 
          style={{ left: "0%", top: "75%", animation: "float 3.5s ease-in-out infinite 0.7s" }}
          size={24}
        />

        {/* Extra Icons on the Right Side (evenly spaced) */}
        <Gift 
          className="absolute text-pink-300" 
          style={{ right: "0%", top: "15%", animation: "float 4s ease-in-out infinite 1.1s" }}
          size={26}
        />
        <Award 
          className="absolute text-yellow-400" 
          style={{ right: "0%", top: "75%", animation: "float 3.8s ease-in-out infinite 0.8s" }}
          size={24}
        />
      </div>
      
      {/* Main content container */}
      <div className="relative w-full max-w-md mx-auto p-10" style={{ zIndex: 2 }}>
        <div className="text-center">
          <div className="flex items-center justify-center mb-10">
            <div className="relative">
              {/* Heart logo container with strict white background and brighter elements */}
              <div className="w-36 h-36 rounded-full bg-white shadow-2xl flex items-center justify-center animate-scaleIn border-2 border-red-400 overflow-hidden">
                {/* Subtle white overlay for brightness */}
                <div className="absolute inset-0 bg-gradient-to-br from-white to-white opacity-30"></div>
                <Heart className="w-16 h-16 text-red-600" style={{ filter: "brightness(1.2)" }} />
              </div>
              <div className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-full w-10 h-10 flex items-center justify-center shadow-lg animate-bounce">
                <Star className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          
          <h1 
            className="text-7xl font-extrabold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-500 tracking-tight animate-slideInUp"
            style={{ fontFamily: "'Poppins', sans-serif", lineHeight: "1.2", padding: "0 10px" }}
          >
            PledgeIt
          </h1>
          <p 
            className="text-2xl font-light animate-slideInUp animation-delay-300 text-gray-600 mb-8"
            style={{ lineHeight: "1.3", padding: "0 10px" }}
          >
            Make a difference, one pledge at a time
          </p>
          
          <div className="mt-10 relative">
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-red-400 to-pink-400 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
