import React from "react";

const HomeImage = () => {
  return (
    <>
      <div className="relative inset-0 bg-gradient-to-l from-white/20 to-transparent rounded-l-3xl " />
      <img
        src="https://images.unsplash.com/photo-1593113598332-cd288d649433?"
        alt="Volunteers working together"
        className="hidden object-cover w-150 h-130 rounded-3xl sm:block mx-10 "
      />
    </>
  );
};

export default HomeImage;
