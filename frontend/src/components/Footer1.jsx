import { Typography } from "@material-tailwind/react";
import { Facebook, Instagram, Linkedin,Mail } from "lucide-react";

const currentYear = new Date().getFullYear();

function Footer1() {
  return (
    <footer className="relative w-full bg-white/80 text-gray-500 z-100 px-10 ">
      <div className="flex w-full flex-col items-center justify-center py-4 md:flex-row md:justify-between   ">
        <Typography
          variant="small"
          className="mb-4 text-center font-normal md:mb-0"
        >
          &copy; {currentYear}{" "}
          <a href="https://material-tailwind.com/">PledgeIt</a>. All Rights
          Reserved.
        </Typography>
        <div className="flex gap-4 text-blue-gray-900 sm:justify-center">
          <Typography
            as="a"
            href="#"
            className="opacity-80 transition-opacity hover:opacity-100"
          >
            <Instagram className="h-5 w-5" />
          </Typography>
          <Typography
            as="a"
            href="#"
            className="opacity-80 transition-opacity hover:opacity-100"
          >
            <Linkedin className="h-5 w-5" />
          </Typography>
          <Typography
            as="a"
            href="pledgeit6@gmail.com"
            className="opacity-80 transition-opacity hover:opacity-100"
          >
            <Mail className="h-5 w-5" />
          </Typography>
        </div>
      </div>
    </footer>
  );
}
export default Footer1;
