import Image from "next/image";
import React from "react";
import hand from "../assets/handy.png";
import Link from "next/link";

const VoteImage = () => {
	return (
		<main className="bg-white flex pb-[40px] lg:pb-[65px] justify-center mt-[60px] md:mt-[320px] lg:mt-[370px] text-white">
			<section className="w-[90%] lg:w-full max-w-[1280px] flex justify-center items-center">
				{/* Layout container */}
				<div className="w-full mx-auto flex flex-col lg:flex-row justify-center items-center gap-[40px] lg:gap-[60px]">

					{/* LEFT SIDE — TEXT SECTION */}
					<div className="w-full md:w-[90%] lg:w-fit pt-[20px] lg:pt-[35px] text-center md:text-center lg:text-left">
						<h1 className="uppercase w-fit text-[#343434] text-2xl md:text-[32px] text-center mx-auto lg:mx-0 md:mb-[20px] text-left md:text-center lg:text-left tracking-0 leading-[32px]"> VOTE FOR YOUR <br /> <span className="text-[#3B8501] font-bold"> FAVORITE NOMINATION </span>{" "} </h1>

						<div className="text-[#343434] text-[14px] md:text-base md:w-[90%] lg:w-[598px] mt-[8px] lg:mt-[24px] leading-[20px] lg:leading-[24px] text-center lg:text-left mx-auto lg:mx-0">
							<p>
								Welcome to the official voting website for the
								2025 Local Government Service Commission Week
								Awards!
							</p>
							<p className="my-[8px]">
								This year, as we celebrate the invaluable
								contributions of our dedicated local government
								workforce, we invite you to participate directly
								in recognizing excellence. Your vote is crucial
								in honoring the individuals and teams who have
								gone above and beyond to serve our communities.
							</p>
							<p>
								Browse through the inspiring nominations, learn
								about the incredible initiatives and unwavering
								commitment of your colleagues, friends, and
								family — then cast your vote for those who truly
								embody the spirit of public service.
							</p>
							<p className="my-[8px]">
								Thank you for being a part of this special
								recognition event. Your participation ensures
								that deserving efforts are celebrated and that
								we continue to foster a culture of dedication
								and innovation within the Local Government
								Service Commission.
							</p>
							<p>Voting is now open. Let your voice be heard!</p>
						</div>

						<Link href="#categories">
							<button className="bg-[#3B8501] rounded-[10px] mt-[25px] text-white w-[180px] md:w-[220px] lg:w-[274px] h-[49px] transition-all hover:bg-[#326d01]">
								VOTE NOW
							</button>
						</Link>
					</div>

					{/* RIGHT SIDE — IMAGE */}
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
