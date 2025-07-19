"use client";

import VotingRules from "./VotingRules";
import VoteImage from "./VoteImage";
import HowToVote from "./HowToVote";
import Categories  from "./Categories";
import Timer from "./Timer";
import FixedVoteWidget from "./FixedVoteWidget";
import { VoteProvider } from "../context/VoteContext"; 
import Officials from "./Officials";
import Leaderboard from "./Leaderboard";
import TimerMobile from "./TimerMobile";
import Navbar from "./Navbar";

const HomepageContent = () => {
  return (
    <>
    <Navbar />
      <div className="flex justify-center">
        <div className="relative w-full">
          <div className="image2 absolute hidden md:block inset-0 w-full h-[800px] md:h-[900px] mb-[00px]"></div>
          <div className="image3 absolute md:hidden inset-0 w-full h-[800px] md:h-[900px] mb-[00px]"></div>
          <div className="w-full relative lg:max-w-[1280px] mx-auto">
            <div className="flex text-[#FAFAFA] justify-center items-center w-full mt-[326px] md:mt-[166px]">
              <div>
                <h1 className="font-bold text text-2xl text-center md:text-[53px] tracking-0 leading-[43px]">
                  2025 OSLGSC
                </h1>
                <h1 className="text text-center font-extrabold text-[77px] md:text-[102px] tracking-0 leading-[100%]">
                  AWARD
                </h1>
                <div className="hidden md:block">
                  <Timer />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="md:hidden block">
        <TimerMobile />
      </div>
      <VoteImage />
      <Officials />
      <VotingRules />
      <HowToVote />
      <Leaderboard />
      <Categories />
      <FixedVoteWidget />
      
      <div className="h-24 md:h-28"></div>
    </>
  );
};

const Homepage = () => {
  return (
    <VoteProvider>
      <HomepageContent />
    </VoteProvider>
  );
};

export default Homepage;