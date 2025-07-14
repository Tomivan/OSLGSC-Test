import React from "react";

const HowToVote = () => {
	return (
		<main className="bg-[white] flex md:pb-[65px] pb-[40px] justify-center text-white ">
			<section className="md:w-full w-[90%] md:max-w-[1280px] flex justify-center items-center ">
				<div className=" md:pt-[95px] pt-[40px] ">
					<h1 className="text-[#3B8501] text-center uppercase font-bold text-2xl md:text-[32px] tracking-0 leading-[43px]">
						How to vote
					</h1>
					<p className="text-[#343434] font-bold mt-[8px] text-center md:mt-[16px] text-xs md:text-base tracking-0 leading-[20px] md:leading-[100%]">
						The steps below provide information on how to cast a
						valid vote for your favourite nominee(s)
					</p>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-[0px] md:gap-[15px] mt-[24px]">
						<div className="bg-[#3B8501] p-[26px] rounded-[10px]">
							<h2 className=" text-[10px] md:text-[13px] tracking-0 text-[#FAFAFA] leading-[20px] md:leading-[100%]">
								Step 1
							</h2>
							<h1 className="font-bold text-[14px] md:text-[18px] tracking-0 text-[#FAFAFA] leading-[20px] md:leading-[24px] my-[6px] ">
								SELECT YOUR CATEGORY
							</h1>
							<p className="md:w-[261px] w-[313px] text-[11px] md:text-[14px] tracking-0 leading-[20px] md:leading-[24px] text-[#FAFAFA] ">
								Click on the category tab in which your
								nominee(s) are selected for, this will open up
								all the nominees in the category.{" "}
							</p>
						</div>
						<div className="bg-[#3B8501] p-[26px] md:my-[0px] my-[12px] rounded-[10px]">
							<h2 className=" text-[10px] md:text-[13px] tracking-0 text-[#FAFAFA] leading-[20px] md:leading-[100%]">
								Step 2
							</h2>
							<h1 className="font-bold text-[14px] md:text-[18px] tracking-0 text-[#FAFAFA] leading-[20px] md:leading-[24px] my-[6px] ">
								VOTE FOR YOUR NOMINEE
							</h1>
							<p className="md:w-[261px] w-[313px] text-[11px] md:text-[14px] tracking-0 leading-[20px] md:leading-[24px] text-[#FAFAFA] md:pr-0 pr-[10px] ">
								Use the sign “+” to increase your vote count and
								sign “-” to reduce your vote count (You can vote
								for multiple nominees.)
							</p>
						</div>
						<div className="bg-[#3B8501] p-[26px] rounded-[10px]">
							<h2 className=" text-[10px] md:text-[13px] tracking-0 text-[#FAFAFA] leading-[20px] md:leading-[100%]">
								Step 3
							</h2>
							<h1 className="font-bold text-[14px] md:text-[18px] tracking-0 text-[#FAFAFA] leading-[20px] md:leading-[24px] my-[6px] ">
								SUBMIT YOUR VOTE
							</h1>
							<p className="md:w-[261px] w-[313px] text-[11px] md:text-[14px] tracking-0 leading-[20px] md:leading-[24px] text-[#FAFAFA] ">
								Click on submit button, then follow the prompt
								to cast your votes.
								<br />
								<span className="text-[#F3FF0D] font-bold">
									<i>
										{" "}
										Note: Your vote only counts when you
										payment is confirmed
									</i>
								</span>
							</p>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
};

export default HowToVote;
