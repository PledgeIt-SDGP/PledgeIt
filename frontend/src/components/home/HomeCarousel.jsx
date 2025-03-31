import { Carousel, Typography } from "@material-tailwind/react";

export function HomeCarousel() {
  return (
    // Carousel component containing multiple slides

    <Carousel className="rounded-xl">
      {/* First slide */}

      <div className="relative h-full w-full">
        <img
          src="https://res.cloudinary.com/dwh8vc3ua/image/upload/v1742659364/carousel2_gxii5n.avif"
          alt="image 1"
          className="h-[700px] w-full object-cover"
        />
        {/* Overlay with quote */}

        <div className="absolute inset-0 grid h-[700px] w-full place-items-center bg-black/35">
          <div className="w-3/4 text-center md:w-2/4">
            <Typography
              variant="h1"
              color="white"
              className="mb-4 text-3xl md:text-4xl lg:text-5xl text-justify"
            >
              "We make a living by what we get, but we make a life by what we
              give."
            </Typography>
            <Typography variant="lead" color="white" className="text-2xl mb-10">
              -Winston Churchill
            </Typography>
          </div>
        </div>
      </div>
      {/* Second slide */}

      <div className="relative h-full w-full">
        <img
          src="https://res.cloudinary.com/dwh8vc3ua/image/upload/v1742658637/carouesel1_boktvu.jpg"
          alt="image 2"
          className="h-[700px] w-full object-cover"
        />
        {/* Overlay with quote */}

        <div className="absolute inset-0 grid h-[700px] w-full items-end bg-black/35">
          <div className="w-3/4 pl-12 md:w-2/4 md:pl-20 lg:pl-32">
            <Typography
              variant="h1"
              color="white"
              className="mb-4 text-3xl md:text-4xl lg:text-5xl"
            >
              "Volunteers do not necessarily have the time; they just have the
              heart."{" "}
            </Typography>
            <Typography variant="lead" color="white" className="text-2xl mb-10">
              -Elizabeth Andrew
            </Typography>
          </div>
        </div>
      </div>

      {/* Third slide */}

      <div className="relative h-full w-full">
        <img
          src="https://res.cloudinary.com/dwh8vc3ua/image/upload/v1742664243/team-environment-volunteers-digging-holes-planting-small-trees_482257-90982_o5ujk8.avif"
          alt="image 3"
          className="h-[700px] w-full object-cover"
        />
        {/* Overlay with quote */}

        <div className="absolute inset-0 grid h-[700px] w-full items-end bg-black/35">
          <div className="w-3/4 pl-12 pb-12 md:w-2/4 md:pl-20 md:pb-20 lg:pl-32 lg:pb-32">
            <Typography
              variant="h1"
              color="white"
              className="mb-4 text-3xl md:text-4xl lg:text-5xl text-left"
            >
              "Small acts, when multiplied by millions of people, can transform
              the world."
            </Typography>
            <Typography variant="lead" color="white" className="text-2xl mb-10">
              -Winston Churchill
            </Typography>
          </div>
        </div>
      </div>
    </Carousel>
  );
}
export default HomeCarousel;