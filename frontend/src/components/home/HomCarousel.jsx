import { Carousel, Typography, Button } from "@material-tailwind/react";

export function HomeCarousel() {
  return (
    <Carousel className="rounded-xl">
      <div className="relative h-full w-full">
        <img
          src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHZvbHVudGVlcnxlbnwwfHwwfHx8MA%3D%3D"
          alt="image 1"
          className="h-[700px] w-full object-cover"
        />
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

      <div className="relative h-full w-full">
        <img
          src="assests/carouesel1.jpg"
          alt="image 2"
          className="h-[700px] w-full object-cover"
        />
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

      <div className="relative h-full w-full">
        <img
          src="https://img.freepik.com/free-photo/team-environment-volunteers-digging-holes-planting-small-trees_482257-90982.jpg?t=st=1740836218~exp=1740839818~hmac=51298889e5c730dd6ef673f117ff8d56a3a1cc62c064876c7fff1a467118e46d&w=2000"
          alt="image 3"
          className="h-[700px] w-full object-cover"
        />
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
