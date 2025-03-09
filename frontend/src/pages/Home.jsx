import React from "react";
import { Link } from "react-router-dom";
import HomeImage from "../components/home/HomeImage";
import HomeCards from "../components/home/HomeCards";
import HomeFeature from "../components/home/HomeFeature";
import { Heart } from "lucide-react";
import HomeCities from "../components/home/HomeCities";
import HomeAboutUs from "../components/home/HomeAboutUs";
import HomeEvent from "../components/home/HomeEvent";
import HomeCarousel from "../components/home/HomCarousel";
import HomeTimeLine from "../components/home/HomeTimeLine";
import { FooterWithSitemap } from "../components/nav&footer/Footer";
import NavBar from "../components/nav&footer/ResponsiveAppBar";

const Home = () => {
  return (
    <>
    <NavBar />
      <div className="relative flex flex-row items-center mt-12 px-10  min-h-screen lg:mt-0">
        {/* Left Content */}
        <div className="flex flex-col justify-center max-w-2xl space-y-6">
          <span className="flex flex-row gap-2 text-lg font-medium text-orange-600">
            <Heart className="w-6 h-6 text-orange-600" />
            Welcome to PledgeIt
          </span>

          <h1 className="text-4xl font-bold text-gray-900 lg:text-6xl">
            Empowering Change
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-red-600 to-pink-600">
              Across Sri Lanka
            </span>
          </h1>

          <p className="text-lg text-gray-600">
            Join a vibrant community of change-makers transforming lives in
            Colombo, Galle, Kandy, and beyond. Your journey to making a
            difference starts here.
          </p>

          <div className="flex space-x-4">
            <Link
              to="/event"
              className="px-6 py-3 text-sm font-medium text-white rounded-full bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 hover:opacity-80"
            >
              Start your journey
            </Link>
            <Link
              to="/about"
              className="px-6 py-3 text-sm font-medium border-2 border-orange-600 text-orange-600 rounded-full hover:bg-orange-50"
            >
              Learn More
            </Link>
          </div>

          <HomeCards />
        </div>

        <div className="hidden lg:block mx-10">
          {/* Right Image */}
          <HomeImage />
        </div>
      </div>

      <div id="about" className="mt-10" >
        <HomeAboutUs />
      </div>
      <div className="text-4xl text-center text-black font-bold py-10 mt-10">
        Why Choose Us?{" "}
      </div>

      <div className="flex flex-row gap-7 mx-10 mb-20">
        <HomeFeature />
      </div>

      <div className="my-10">
        <HomeCarousel />
      </div>

      <div className="mx-10 my-10">
        <HomeCities />
      </div>

      <div  id="events" className="my-10">
        <HomeEvent />
      </div>

      <div className="m-10">
        <HomeTimeLine />
      </div>

      <div className="relative flex mt-10 md:block lg:block">
        <img
          src="/assests/bg4.png"
          alt="bg1"
          className="w-full h-[480px] object-cover "
        />

        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <span className="text-white  text-xl mt-5 font-extrabold md:text-2xl lg:text-3xl">
            Join with us in making a difference today & <br />A better future!
          </span>
          <br />
          <button className="mt-2 px-3 py-1 bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 hover:opacity-80 text-sm text-white font-semibold rounded-lg shadow-md hover:bg-gray-200  lg:mt-4 lg:px-6 lg:py-3 lg:text-base">
            Get Involved
          </button>
        </div>
      </div>
      <FooterWithSitemap />
    </>
  );
};

export default Home;
