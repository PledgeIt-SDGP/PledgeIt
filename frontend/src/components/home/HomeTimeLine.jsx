import {
  Timeline,
  TimelineItem,
  TimelineConnector,
  TimelineHeader,
  TimelineIcon,
  TimelineBody,
  Typography,
} from "@material-tailwind/react";
import {
  HomeIcon,
  BellIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/solid";

function TimeLine() {
  return (
    <>
      <div className="text-3xl font-bold text-black text-center mb-6 lg:text-4xl ">
        Features We Offer
      </div>
      <div className="md:flex flex-col-2  lg:flex flex-col-2 ">
        <div className="w-[20rem]  lg:w-[32rem] pl-20">
          <Timeline>
            <TimelineItem>
              <TimelineConnector />
              <TimelineHeader>
                <TimelineIcon className="p-2">
                  <HomeIcon className="h-4 w-4" />
                </TimelineIcon>
                <Typography variant="h5" color="blue-gray">
                  Timeline Title Here.
                </Typography>
              </TimelineHeader>
              <TimelineBody className="pb-8">
                <Typography color="gary" className="font-normal text-gray-600">
                  The key to more success is to have a lot of pillows. Put it
                  this way, it took me twenty five years to get these plants,
                  twenty five years of blood sweat and tears, and I&apos;m never
                  giving up, I&apos;m just getting started. I&apos;m up to
                  something. Fan luv.
                </Typography>
              </TimelineBody>
            </TimelineItem>
            <TimelineItem>
              <TimelineConnector />
              <TimelineHeader>
                <TimelineIcon className="p-2">
                  <BellIcon className="h-4 w-4" />
                </TimelineIcon>
                <Typography variant="h5" color="blue-gray">
                  Timeline Title Here.
                </Typography>
              </TimelineHeader>
              <TimelineBody className="pb-8">
                <Typography color="gary" className="font-normal text-gray-600">
                  The key to more success is to have a lot of pillows. Put it
                  this way, it took me twenty five years to get these plants,
                  twenty five years of blood sweat and tears, and I&apos;m never
                  giving up, I&apos;m just getting started. I&apos;m up to
                  something. Fan luv.
                </Typography>
              </TimelineBody>
            </TimelineItem>
            <TimelineItem>
              <TimelineHeader>
                <TimelineIcon className="p-2">
                  <CurrencyDollarIcon className="h-4 w-4" />
                </TimelineIcon>
                <Typography variant="h5" color="blue-gray">
                  Timeline Title Here.
                </Typography>
              </TimelineHeader>
              <TimelineBody>
                <Typography color="gary" className="font-normal text-gray-600">
                  The key to more success is to have a lot of pillows. Put it
                  this way, it took me twenty five years to get these plants,
                  twenty five years of blood sweat and tears, and I&apos;m never
                  giving up, I&apos;m just getting started. I&apos;m up to
                  something. Fan luv.
                </Typography>
              </TimelineBody>
            </TimelineItem>
          </Timeline>
        </div>
        <div className="lg:flex flex-col mt-10 w-[27rem] md:w-[30rem] md:mt-50 lg:w-[50rem] lg:pl-30 lg:mt-15">
          <img src="assests/features4.png" alt="line" />
        </div>
      </div>
    </>
  );
}
export default TimeLine;
