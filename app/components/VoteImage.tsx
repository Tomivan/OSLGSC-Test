import Image from "next/image";
import React from "react";
import hand from "../assets/hand.png";

const VoteImage = () => {
	return (
		<main className="bg-[#343434] flex md:pb-[65px] pb-[40px] justify-center mt-[50px] text-white ">
			<section className="md:w-full w-[90%] md:max-w-[1280px] flex justify-center items-center ">
				<div className="md:flex w-[80%] mx-auto md:gap-[35px] justify-center">
					<div className="w-fit md:pt-[95px] pt-[40px] text-center md:text-left ">
						<h1 className="uppercase w-fit text-[#FAFAFA] font-bold text-2xl md:text-[32px] tracking-0 leading-[43px]">
							VOTE FOR YOUR <br />
							<span className="text-[#3B8501]">
								FAVORITE NOMINATION
							</span>{" "}
						</h1>
						<p className="text-[#FAFAFA] text-[14px] md:text-base md:w-[420px] mt-[16px] md:mt-[24px] tracking-0 leading-[20px] md:leading-[28px]">
							Support your favourites, vote for your contestant
							and let’s help them get recognised in this season.
						</p>
						<button className="bg-[#3B8501] hover:bg-[] rounded-[8.4px] mt-[35px] md:mt-[25px] text-[] w-[274px] h-[49px] ">
							VOTE NOW
						</button>
					</div>
					<Image
						src={hand}
						alt="hamd"
						className="w-[  md:pt-[75px] pt-[40px]"
					/>
				</div>
			</section>
		</main>
	);
};

export default VoteImage;
