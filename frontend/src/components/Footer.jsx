import { Typography } from "@material-tailwind/react";
import { Heart, Facebook, Instagram, Linkedin, Mail } from "lucide-react";

const SITEMAP = [
  {
    title: "About",
    links: [
      { name: "Empowering volunteers across Sri Lanka to make a difference in their communities.", href: "#" },
    ],
  },
  {
    title: "Help Center",
    links: [
      { name: "Terms & Conditions", href: "#" },
      { name: "Contact Us", href: "#" },
    ],
  },
  {
    title: "Links",
    links: [
      { name: "Home", href: "#Home" },
      { name: "About", href: "#HomeAboutUs" },
      { name: "Features", href: "#Features" },
    ],
  },
];

const currentYear = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="relative w-full bg-gray-900 text-white ">
      <div className="mx-auto w-full max-w-7xl px-4">
        <div className="flex items-center gap-2 mb-4 pt-5">
          <Heart className="w-6 h-6 text-orange-500" />
          <span className="text-xl font-bold">PledgeIt</span>
        </div>

        <div className="mx-auto grid w-full grid-cols-1 gap-17 py-10 md:grid-cols-3 lg:grid-cols-3">
          {SITEMAP.map(({ title, links }, key) => (
            <div key={key} className="w-full">
              <Typography variant="small" color="blue-gray" className="mb-6 font-bold uppercase opacity-50 ">
                {title}
              </Typography>
              <ul className="space-y-4">
                {links.map(({ name, href }, index) => (
                  <li key={index}>
                    <a href={href} className="hover:underline">
                      {name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex w-full flex-col items-center justify-center border-t border-blue-gray-50 py-4 md:flex-row md:justify-between">
          <Typography variant="small" className="mb-4 text-center font-normal text-blue-gray-900 md:mb-0">
            &copy; {currentYear}{" "}
            <a href="https://material-tailwind.com/">PledgeIt</a>. All Rights Reserved.
          </Typography>
          <div className="flex gap-4 text-blue-gray-900 sm:justify-center">
            <a href="https://www.instagram.com/pledge_it" target="_blank" className="opacity-80 transition-opacity hover:opacity-100">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="https://www.linkedin.com/company/pledgeit/" target="_blank" className="opacity-80 transition-opacity hover:opacity-100">
              <Linkedin className="h-5 w-5" />
            </a>
            <a href="mailto:pledgeit6@gmail.com" target="_blank" className="opacity-80 transition-opacity hover:opacity-100">
              <Mail className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
