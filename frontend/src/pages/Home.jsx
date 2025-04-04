import React from "react";
import { Link } from "react-router-dom";
import HomeImage from "../components/home/HomeImage";
import HomeCards from "../components/home/HomeCards";
import HomeFeature from "../components/home/HomeFeature";
import { Heart } from "lucide-react";
import HomeCities from "../components/home/HomeCities";
import HomeAboutUs from "../components/home/HomeAboutUs";
import HomeEvent from "../components/home/HomeEvent";
import HomeCarousel from "../components/home/HomeCarousel";
import HomeTimeLine from "../components/home/HomeTimeLine";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
};

const Home = () => {
  return (
    <>
      <NavBar />
      {/* Hero Section */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="relative flex flex-row items-center mt-8 px-5 md:mt-10  md:px-4 lg:px-8 lg:mt-5 w-full"
      >
        <div
          id="Home"
          className="relative flex flex-row items-center mt-8 md:px-4 lg:px-8  md:mt-5 lg:mt-10 w-full"
        >
          {/* Left Content */}
          <div className="flex flex-col justify-center max-w-2xl space-y-6 ">
            <span className="flex flex-row gap-2 text-lg font-medium text-orange-600">
              <Heart className="w-6 h-6 text-orange-600" />
              Welcome to PledgeIt
            </span>

            <motion.h1
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-4xl font-bold text-gray-900 lg:text-6xl"
            >
              Empowering Change
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-red-600 to-pink-600">
                Across Sri Lanka
              </span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-lg text-gray-600"
            >
              Join a vibrant community of change-makers transforming lives in
              Colombo, Galle, Kandy, and beyond. Your journey to making a
              difference starts here.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex space-x-4"
            >
              <Link
                to="/userpage"
                className="px-4 py-3 text-sm font-medium text-white rounded-full bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 hover:opacity-80 lg:px-6 lg:py-3"
              >
                Start your journey
              </Link>
              <a
                href="#HomeFeature"
                className="px-4 py-3 text-sm font-medium border-2 border-orange-600 text-orange-600 rounded-full hover:bg-orange-50 lg:px-6 lg:py-3 "
              >
                Learn More
              </a>
            </motion.div>

            <HomeCards />
          </div>

          <div className="hidden lg:block mx-10">
            {/* Right Image */}
            <HomeImage />
          </div>
        </div>
      </motion.div>

      <div className="mt-20 lg:mt-30">
        <HomeAboutUs />
      </div>

      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="text-4xl text-center text-black font-bold py-10 mt-10"
      >
        Why Choose Us?{" "}
      </motion.div>

      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="flex flex-row gap-7 mx-10 mb-20"
      >
        <HomeFeature />
      </motion.div>

      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="my-10"
      >
        <HomeCarousel />
      </motion.div>

      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="mx-10 my-10"
      >
        <HomeCities />
      </motion.div>

      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="my-10"
      >
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6 lg:text-4xl">
          Latest Volunteer Events
        </h2>
        <HomeEvent
          style={{
            backgroundImage: "url('/assests/bg3.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      </motion.div>

      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="m-10"
        id="Features"
      >
        <HomeTimeLine />
      </motion.div>

      <motion.div className="relative flex mt-10 md:block lg:block">
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
          <button className="mt-2 px-3 py-1 bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 hover:opacity-80 text-sm text-white font-semibold rounded-lg shadow-md hover:bg-gray-200  md:text- md:px-6 md:py-3  lg:mt-4 lg:px-6 lg:py-3 lg:text-xl">
            <Link
              to="/userpage"
            >
              Get Involved
            </Link>
          </button>
        </div>
      </motion.div>
      <Footer />
    </>
  );
};

export default Home;