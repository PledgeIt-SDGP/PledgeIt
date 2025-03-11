import {
  Timeline,
  TimelineItem,
  TimelineConnector,
  TimelineHeader,
  TimelineIcon,
  TimelineBody,
  Typography,
} from "@material-tailwind/react";

import { AdjustmentsHorizontalIcon, ChatBubbleOvalLeftEllipsisIcon, CurrencyDollarIcon } from "@heroicons/react/20/solid";
import { ArrowRightFromLine, Sparkles } from "lucide-react";

function TimeLine() {
  return (
    <>
      <div className="text-3xl font-bold text-black text-center mb-6 lg:text-4xl ">
        Features We Offer
      </div>
      <div className="md:flex flex-col-2  lg:flex flex-col-2">
        <div className="w-[20rem]  lg:w-[32rem] lg:pl-20">
          <Timeline>
            <TimelineItem>
              <TimelineConnector />
              <TimelineHeader>
                <TimelineIcon className="p-2">
                  <Sparkles className="h-4 w-4" />
                </TimelineIcon>
                <Typography variant="h5" color="blue-gray">
                  XP Points & Leaderboard
                </Typography>
              </TimelineHeader>
              <TimelineBody className="pb-9">
                <Typography color="gray" className="font-normal text-gray-600">
                  Gain XP points for every event you participate in! Level up,
                  unlock rewards, and see how you rank among fellow volunteers
                  on our interactive leaderboard.
                </Typography>
              </TimelineBody>
            </TimelineItem>
            <TimelineItem>
              <TimelineConnector />
              <TimelineHeader>
                <TimelineIcon className="p-2">
                  <ArrowRightFromLine className="h-4 w-4" />
                </TimelineIcon>
                <Typography variant="h5" color="blue-gray">
                  Automated Attendance for Organizations
                </Typography>
              </TimelineHeader>
              <TimelineBody className="pb-9">
                <Typography color="gray" className="font-normal text-gray-600">
                  Say goodbye to manual check-ins! Our automated system ensures
                  accurate attendance tracking, making event management seamless
                  for organizers.
                </Typography>
              </TimelineBody>
            </TimelineItem>
            <TimelineItem>
              <TimelineHeader>
                <TimelineIcon className="p-2">
                  <ChatBubbleOvalLeftEllipsisIcon className="h-4 w-4" />
                </TimelineIcon>
                <Typography variant="h5" color="blue-gray">
                  Instant Chat Support
                </Typography>
              </TimelineHeader>
              <TimelineBody className="pb-9">
                <Typography color="gray" className="font-normal text-gray-600">
                  Need help? Our chatbot is available 24/7 to assist you with
                  event details, volunteer guidelines, and more.
                </Typography>
              </TimelineBody>
            </TimelineItem>
            <TimelineItem>
              <TimelineHeader>
                <TimelineIcon className="p-2">
                  <AdjustmentsHorizontalIcon className="h-4 w-4" />
                </TimelineIcon>
                <Typography variant="h5" color="blue-gray">
                  Easy Searching with Filters
                </Typography>
              </TimelineHeader>
              <TimelineBody>
                <Typography color="gray" className="font-normal text-gray-600">
                  Find the perfect volunteering opportunity effortlessly! Use
                  our advanced filter options to sort by location, type of
                  event, or causes that matter to you.
                </Typography>
              </TimelineBody>
            </TimelineItem>
          </Timeline>
        </div>
        <div className="lg:flex flex-col mt-10  w-[20rem] md:w-[30rem] md:mt-130  lg:w-[40rem] lg:pl-30 lg:mt-15">
          <img src="assests/features.png" alt="line" />
        </div>
      </div>
    </>
  );
}
export default TimeLine;
