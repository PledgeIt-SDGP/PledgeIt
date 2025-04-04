// import { Carousel, Typography, Button } from "@material-tailwind/react";


// export function HomeCarousel() {
//   return (
//     <Carousel className="rounded-xl">
//       <div className="relative h-full w-full">
//         <img
//           src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHZvbHVudGVlcnxlbnwwfHwwfHx8MA%3D%3D"
//           alt="image 1"
//           className="h-[700px] w-full object-cover"
//         />
//         <div className="absolute inset-0 grid h-[700px] w-full place-items-center bg-black/35">
//           <div className="w-3/4 text-center md:w-2/4">
//             <Typography
//               variant="h1"
//               color="white"
//               className="mb-4 text-3xl md:text-4xl lg:text-5xl text-justify"
//             >
//               "We make a living by what we get, but we make a life by what we
//               give."
//             </Typography>
//             <Typography variant="lead" color="white" className="text-2xl mb-10">
//               -Winston Churchill
//             </Typography>
//           </div>
//         </div>
//       </div>

//       <div className="relative h-full w-full">
//         <img
//           src="https://img.freepik.com/free-photo/close-up-veterinarian-taking-care-dog_23-2149100187.jpg?t=st=1740834973~exp=1740838573~hmac=20da7feb0b8cc4cc491ece2868d66ef4adaa8aafa69d613b498032c76b6d14ce&w=2000"
//           alt="image 2"
//           className="h-[700px] w-full object-cover"
//         />
//         <div className="absolute inset-0 grid h-[700px] w-full items-center bg-black/35">
//           <div className="w-3/4 pl-12 md:w-2/4 md:pl-20 lg:pl-32">
//             <Typography
//               variant="h1"
//               color="white"
//               className="mb-4 text-3xl md:text-4xl lg:text-5xl"
//             >
//               "Volunteers do not necessarily have the time; they just have the
//               heart."{" "}
//             </Typography>
//             <Typography variant="lead" color="white" className="text-2xl mb-10">
//               -Elizabeth Andrew
//             </Typography>
//           </div>
//         </div>
//       </div>

//       <div className="relative h-full w-full">
//         <img
//           src="https://img.freepik.com/free-photo/team-environment-volunteers-digging-holes-planting-small-trees_482257-90982.jpg?t=st=1740836218~exp=1740839818~hmac=51298889e5c730dd6ef673f117ff8d56a3a1cc62c064876c7fff1a467118e46d&w=2000"
//           alt="image 3"
//           className="h-[700px] w-full object-cover"
//         />
//         <div className="absolute inset-0 grid h-[700px] w-full items-end bg-black/35">
//           <div className="w-3/4 pl-12 pb-12 md:w-2/4 md:pl-20 md:pb-20 lg:pl-32 lg:pb-32">
//             <Typography
//               variant="h1"
//               color="white"
//               className="mb-4 text-3xl md:text-4xl lg:text-5xl text-left"
//             >
//               "Small acts, when multiplied by millions of people, can transform
//               the world."
//             </Typography>
//             <Typography variant="lead" color="white" className="text-2xl mb-10">
//               -Winston Churchill
//             </Typography>
//           </div>
//         </div>
//       </div>
//     </Carousel>

//   );
// }
// export default HomeCarousel;

import { useState } from "react";

const images = [
  "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHZvbHVudGVlcnxlbnwwfHwwfHx8MA%3D%3D",
  "https://img.freepik.com/free-photo/close-up-veterinarian-taking-care-dog_23-2149100187.jpg?t=st=1740834973~exp=1740838573~hmac=20da7feb0b8cc4cc491ece2868d66ef4adaa8aafa69d613b498032c76b6d14ce&w=2000",
  "https://img.freepik.com/free-photo/team-environment-volunteers-digging-holes-planting-small-trees_482257-90982.jpg?t=st=1740836218~exp=1740839818~hmac=51298889e5c730dd6ef673f117ff8d56a3a1cc62c064876c7fff1a467118e46d&w=2000",
];

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
      <div className="relative h-50 overflow-hidden rounded-lg md:h-96 lg:h-150 xl:h-160">
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Slide ${index + 1}`}
            className={`absolute w-full h-full object-cover transition-opacity duration-700 ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          />
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
            <path d="M5 1L1 5l4 4" strokeLinecap="round" strokeLinejoin="round" />
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
            <path d="M1 9l4-4-4-4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>
    </div>
  );
};

export default HomCarousel;