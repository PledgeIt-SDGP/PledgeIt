const HomeAboutUs = () => {
  return (
    
    <div  id="HomeAboutUs" className="relative w-full h-[600px]  ">
      {/* Background Video */}
      <video
        className="absolute top-0 left-0 w-[1500px] h-[600px] object-cover"
        autoPlay
        loop
        muted
      >
        <source src="assests/bg1.mp4" type="video/mp4" />
      </video>

      {/* Overlay Content */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/60">
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white lg:text-4xl pb-10 ">
              Who Are We?
            </h1>
            <p className="mx-5 text-center text-center text-white/90 text-lg lg:text-3xl lg:mx-50">
              "We aims to bridge the gap in accessible volunteer opportunities,
              making it easy for individuals to connect with causes. We are
              working towards a cleaner and healthier society and gain
              recognition for their efforts."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeAboutUs;
