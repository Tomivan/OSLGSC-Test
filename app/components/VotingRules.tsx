import Image from "next/image";
import React from "react";
import rule1 from "../assets/rule1.svg";
import rule2 from "../assets/rule2.svg";
import rule3 from "../assets/rule3.svg";
import rule4 from "../assets/rule4.svg";

const VotingRules = () => {
	return (
		<main className="bg-[#3B8501] flex justify-center text-white ">
			<section className="md:w-full w-[90%] md:max-w-[1280px]  ">
				<div className="my-[60px] md:my-[71px] text-center">
					<h1 className="uppercase text-center font-bold text-2xl md:text-[32px] tracking-0 leading-[100%] ">
						Voting Rules
					</h1>
					<h3 className=" font-bold mt-[8px] md:mt-[16px] text-xs md:text-base tracking-0 leading-[20px] md:leading-[100%]">
						Please all contestant and voters must read through these
						rules to avoid disqualification
					</h3>
					<div className="mt-[20px] md:flex md:gap-[74px] w-fit mx-auto ">
						<div className="w-[160px]">
							<h1 className="text-[20px] uppercase font-bold mt-[16px] tracking-0 leading-[100%]">
								Rule 1
							</h1>
							<p className="text-[#FAFAFA] my-[12px] ">
								Registration is free for all and simple
							</p>
							<Image
								src={rule1}
								alt="Rule 1"
								className="w-[61px] h-[61px] mx-auto mb-[16px]"
							/>
						</div>
						<div className="w-[160px] my-[40px] md:my-0 ">
							<h1 className="text-[20px] uppercase font-bold mt-[16px] tracking-0 leading-[100%]">
								Rule 2
							</h1>
							<p className="text-[#FAFAFA] my-[12px] ">
								Each vote cost N100 i.e. 1 vote = 100
							</p>
							<Image
								src={rule2}
								alt="Rule 1"
								className="w-[61px] h-[61px] mx-auto mb-[16px]"
							/>
						</div>
						<div className="w-[160px]">
							<h1 className="text-[20px] uppercase font-bold mt-[16px] tracking-0 leading-[100%]">
								Rule 3
							</h1>
							<p className="text-[#FAFAFA] my-[12px] ">
								One voter can cast multiple votes
							</p>
							<Image
								src={rule3}
								alt="Rule 1"
								className="w-[61px] h-[61px] mx-auto mb-[16px]"
							/>
						</div>
						<div className="w-[160px] mt-[40px] md:mt-0 ">
							<h1 className="text-[20px] uppercase font-bold mt-[16px] tracking-0 leading-[100%]">
								Rule 4
							</h1>
							<p className="text-[#FAFAFA] my-[12px] ">
								Your payment validates your vote
							</p>
							<Image
								src={rule4}
								alt="Rule 1"
								className="w-[61px] h-[61px] mx-auto mb-[16px]"
							/>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
};

export default VotingRules;
