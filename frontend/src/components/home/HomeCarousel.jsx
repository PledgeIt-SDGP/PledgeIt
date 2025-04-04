import { useState } from "react";

const images = [
  "https://res.cloudinary.com/dwh8vc3ua/image/upload/v1742659364/carousel2_gxii5n.avif",
  "https://res.cloudinary.com/dwh8vc3ua/image/upload/v1742658637/carouesel1_boktvu.jpg",
  "https://res.cloudinary.com/dwh8vc3ua/image/upload/v1742664243/team-environment-volunteers-digging-holes-planting-small-trees_482257-90982_o5ujk8.avif",
];

const captions = [
  "We make a living by what we get, but we make a life by what we give",
  "Volunteers do not necessarily have the time; they just have the heart",
  "Small acts, when multiplied by millions of people, can transform the world.",
];

const person = ["Winston Churchill", "Elizabeth Andrew", "Winston Churchill"];

const HomCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative w-full">
      {/* Carousel Wrapper */}
      <div className="relative h-50 overflow-hidden rounded-lg md:h-96 lg:h-170 xl:h-170">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute w-full h-full transition-opacity duration-700 ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* Image */}
            <img
              src={image}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover"
            />
            {/* Black Overlay */}
            <div className="absolute inset-0 bg-black/50"></div>
            {/* Caption */}
            <div className="absolute left-5 top-1/2 -translate-y-1/2  w-100 text-white text-2xl lg:text-6xl font-semibold  px-4 py-2 rounded-lg lg:w-210 break-words">
              {captions[index]}
              <div className="text-lg lg:text-4xl font-normal text-gray-300 mt-10">
                - {person[index]}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Indicators */}
      <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full ${
              currentIndex === index ? "bg-white" : "bg-gray-400"
            }`}
            aria-label={`Slide ${index + 1}`}
            onClick={() => goToSlide(index)}
          ></button>
        ))}
      </div>

      {/* Previous Button */}
      <button
        onClick={prevSlide}
        className="absolute top-0 left-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
      >
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60">
          <svg
            className="w-4 h-4 text-white"
            fill="none"
            viewBox="0 0 6 10"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              d="M5 1L1 5l4 4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>

      {/* Next Button */}
      <button
        onClick={nextSlide}
        className="absolute top-0 right-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
      >
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60">
          <svg
            className="w-4 h-4 text-white"
            fill="none"
            viewBox="0 0 6 10"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              d="M1 9l4-4-4-4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>
    </div>
  );
};

export default HomCarousel;