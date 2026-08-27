import Image from "next/image";
import React from "react";
import hand from "../assets/handy.png";
import Link from "next/link";

const VoteImage = () => {
	return (
		<main className="bg-white pb-[40px] lg:pb-[65px] md:mt-[120px] lg:mt-[270px] text-white">
			<h2 className="uppercase text-[#3B8501] text-center font-bold p-4 md:mb-[60px] mt-[30px] text-[20px] md:text-[32px] tracking-0 leading-[100%]">
				Welcome to the official voting website for the 2026 Local <br />Government Service Commission Week Awards!
			</h2>
			<section className="w-[90%] lg:w-full max-w-[1280px] flex justify-center items-center">
				<div className="w-full mx-auto flex flex-col lg:flex-row justify-center items-center gap-[40px] lg:gap-[60px]">
					<div className="w-full md:w-[90%] lg:w-fit pt-[20px] lg:pt-[35px] text-center md:text-center lg:text-left">
						<h2 className="uppercase w-fit text-[#343434] text-2xl md:text-[32px] mx-auto lg:mx-0 md:mb-[20px] text-left md:text-center lg:text-left tracking-0 leading-[32px]"> VOTE FOR YOUR <br /> <span className="text-[#3B8501] font-bold"> FAVORITE NOMINEE </span>{" "} </h2>

						<div className="text-[#343434] text-[14px] md:text-base md:w-[90%] lg:w-[598px] mt-[8px] lg:mt-[24px] leading-[20px] lg:leading-[24px] text-left ml-[20px] lg:text-left mx-auto lg:mx-0">
							<p className="mb-[8px]">
								As we honor the vital contributions of our committed local government workforce, we invite you to take part in recognizing excellence. Your vote is essential in celebrating the individuals and teams who have gone above and beyond to serve our communities.
							</p>
						</div>

						<Link href="#categories">
							<button className="bg-[#3B8501] rounded-[10px] mt-[25px] text-white w-[180px] md:w-[220px] lg:w-[274px] h-[49px] transition-all hover:bg-[#326d01]">
								VOTE NOW
							</button>
						</Link>
					</div>

					<div className="lg:ml-[10px]">
					<Image
						src={hand}
						alt="hand"
						className="w-[250px] md:w-[280px] lg:w-[330px] h-[320px] md:h-[360px] lg:h-[420px] mt-[40px] lg:mt-0 mx-auto lg:mx-0"
					/>
					</div>
				</div>
			</section>
		</main>
	);
};

export default VoteImage;
