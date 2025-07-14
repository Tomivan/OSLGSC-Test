"use client";
import logo from "../assets/logo.svg";

import Image from "next/image";
import VotingRules from "./VotingRules";
import VoteImage from "./VoteImage";
import HowToVote from "./HowToVote";
import Categories from "./Categories";
import Timer from "./Timer";
import FixedVoteWidget from "./FixedVoteWidget";
import { VoteProvider, useVoteContext } from "../context/VoteContext";
import VoterDetails from "./VoterDetails";
import Officials from "./Officials";
import Leaderboard from "./Leaderboard";
import TimerMobile from "./TimerMobile";

const HomepageContent = () => {
	const { getTotalVotes, getTotalAmount } = useVoteContext();

	const handleVoteNow = () => {
		alert(
			`Proceeding to payment for ${getTotalVotes()} votes (₦${getTotalAmount().toLocaleString()})`
		);
	};

	return (
		<>
			<main className="max-w-md md:max-w-[1280px] mx-auto flex justify-center  bg-white overflow-hidden">
				<section className="p-6 w-full md:w-[500px]">
					<Image
						src={logo}
						alt="OSLGSC Logo"
						className="mx-auto mb-4"
					/>
					<h1 className="font-bold text-lg uppercase text-center text-[#343434] mb-4">
						Ogun State Local Government Service Commission Award
					</h1>
				</section>
			</main>
			<div className="flex justify-center  ">
				<div className="relative w-full">
					<div className="image2 absolute hidden md:block inset-0 w-full h-[800px] md:h-[900px]  mb-[00px]"></div>
					<div className="image3 absolute md:hidden  inset-0 w-full h-[800px] md:h-[900px]  mb-[00px]"></div>
					<div className="w-full relative lg:max-w-[1280px] mx-auto ">
						<div className="flex text-[#FAFAFA] justify-center items-center w-full mt-[326px] md:mt-[166px] ">
							<div>
								<h1 className=" font-bold text text-2xl text-center md:text-[53px] tracking-0 leading-[43px]">
									2025 OSLGSC
								</h1>
								<h1 className="text text-center font-extrabold text-[77px] md:text-[102px] tracking-0 leading-[100%]">
									AWARD
								</h1>
								<div className="hidden md:block ">
									<Timer />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="md:hidden block ">
				<TimerMobile />
			</div>
			<VoteImage />
			<Officials />
			<VotingRules />
			<HowToVote />
			<Leaderboard />
			<Categories />
			<VoterDetails />

			{/* Fixed Vote Widget */}
			<FixedVoteWidget
				totalVotes={getTotalVotes()}
				onVoteNow={handleVoteNow}
				isVisible={true}
			/>
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
