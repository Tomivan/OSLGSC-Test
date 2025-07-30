import Image from "next/image";
import React from "react";
import hand from "../assets/handy.png";
import Link from "next/link";

const VoteImage = () => {
	return (
		<main className="bg-white flex md:pb-[65px] pb-[40px] justify-center md:mt-[325px] mt-[70px] text-white ">
			<section className="md:w-full w-[90%] md:max-w-[1280px] flex justify-center items-center ">
				<div className="md:flex w-full mx-auto md:gap-[95px] justify-center">
					<div className="w-fit md:pt-[35px] pt-80px] text-center md:text-left ">
						<h1 className="uppercase w-fit text-[#343434] text-2xl md:text-[32px] text-center mx-auto md:mx-0 md:text-left  tracking-0 leading-[32px]">
							VOTE FOR YOUR <br />
							<span className="text-[#3B8501] font-bold">
								FAVORITE NOMINATION
							</span>{" "}
						</h1>

						<div className="text-[#343434] text-[14px] md:text-base md:w-[598px] mt-[8px] md:mt-[24px] tracking-0 leading-[20px] md:leading-[24px]">
							<p>
								Welcome to the official voting website for the
								2025 Local Government Service Commission Week
								Awards!{" "}
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
								commitment of your colleagues, friends, family
								and cast your vote for those who truly embody
								the spirit of public service.
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
							<button className="bg-[#3B8501] hover:bg-[] rounded-[10px] mt-[26px] md:mt-[25px] text-[] w-[180px] md:w-[274px] h-[49px] ">
								VOTE NOW
							</button>
						</Link>
					</div>
					<Image
						src={hand}
						alt="hamd"
						className="md:w-[330px] h-[350px] mx-auto md:mx-0 md:h-[420px] mt-[40px]"
					/>
				</div>
			</section>
		</main>
	);
};

export default VoteImage;
