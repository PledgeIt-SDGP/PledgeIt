import React from "react";

function HomeCities() {
  return (
    <div className="bg-white flex flex-col border border-gray-100 lg:flex-row items-center gap-5 p-10 rounded-3xl shadow-lg lg:gap-30">
      {/* Text Section */}
      <div className="flex flex-col max-w-lg mx-10">
        {" "}
        <h2 className="text-4xl font-bold">
          We focus on 3 main cities in{" "}
          <span className="inline-block bg-gradient-to-r from-orange-500 to-red-600 text-transparent bg-clip-text">
            Sri Lanka
          </span>
        </h2>
        <p className="text-gray-600 text-lg mt-4">
          Join us in making an impact in the cities of{" "}
          <strong>Colombo, Galle, and Kandy</strong>! These cities are hubs for
          change, and you can be a part of it.
        </p>
      </div>

      {/* Map Section */}
      <div>
        <img
          src="assests/map4.png"
          alt="Map"
          className="w-70 h-auto md:w-100 lg:w-100 h-auto"
        />
      </div>
    </div>
  );
}

export default HomeCities;
