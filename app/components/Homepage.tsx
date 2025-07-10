"use client";
import logo from "../assets/logo.svg";

import Image from "next/image";
import VotingRules from "./VotingRules";
import VoteImage from "./VoteImage";

const Homepage = () => {
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
			<VoteImage />
			<VotingRules />
		</>
	);
};

export default Homepage;
