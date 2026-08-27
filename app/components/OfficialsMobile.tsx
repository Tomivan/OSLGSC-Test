import Image from "next/image";
import React from "react";
import chairw from "../assets/chairw.svg";
import comm1 from "../assets/comm1.svg";
import comm2 from "../assets/comm2.png";
import comm3 from "../assets/comm3.png";
import comm4 from "../assets/comm4.png";
import perm from "../assets/perm.png";

const OfficialsMobile = () => {
	return (
		<main className="flex justify-center mt-[20px] md:mt-[50px] md:mb-[80px]">
			<section className="md:w-full w-[90%] md:max-w-[1280px] flex justify-center items-center">
				<div className="w-full">
					<div className="w-fit mx-auto mb-[50px] md:mb-[22px]">
						<div className="mb-[16px] md:mb-[22px]">
							<h1 className="text-[#000000] text-[14px] md:text-[20px] font-bold uppercase">
								VOTING IS NOW OPEN.
							</h1>
							<h1 className="text-[#3b8501] text-[14px] md:text-[20px] font-bold uppercase">
								LET YOUR VOICE BE HEARD!
							</h1>
							<p className="text-[#343434] text-[11px] md:text-[14px] mt-[12px] max-w-[600px] mx-auto leading-[20px] md:leading-[24px]">
								Explore the inspiring nominations, learn about the remarkable initiatives and dedication of your colleagues, friends, and family, and cast your vote for those who best embody the spirit of public service.
							</p>
							<p className="text-[#343434] text-[11px] md:text-[14px] mt-[12px] max-w-[600px] mx-auto leading-[20px] md:leading-[24px]">
								Thank you for joining this special recognition event. Your participation helps ensure deserving efforts are celebrated and supports a continued culture of dedication and innovation within the Local Government Service Commission.
							</p>
						</div>

						<Image src={chairw} alt="Chairperson" className="mx-auto" />
						
						<div className="text-[17.7px] leading-[24px] text-center">
							<h1 className="text-[#000000]">
								Ms. Olivia Olubukunola Onabanjo
							</h1>
							<h1 className="text-[#3B8501] uppercase font-bold mt-[8px]">
								CHAIRMAN
							</h1>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-4 w-fit mx-auto md:gap-[34px]">
						<div>
							<Image
								src={comm1}
								alt="commissioner 1"
								className="mx-auto"
							/>
							<div className="text-[17.7px] leading-[24px] text-center">
								<h1 className="text-[#000000]">
									Hon. Lukmon Olufemi Adiro
								</h1>
								<h1 className="text-[#3B8501] uppercase font-bold mt-[8px]">
									Commissioner I
								</h1>
							</div>
						</div>
						<div className="md:my-0 my-[50px]">
							<Image
								src={comm2}
								alt="commissioner 2"
								className="mx-auto"
							/>
							<div className="text-[17.7px] leading-[24px] text-center">
								<h1 className="text-[#000000]">
									Hon. Koye Ijaduoye
								</h1>
								<h1 className="text-[#3B8501] uppercase font-bold mt-[8px]">
									Commissioner II
								</h1>
							</div>
						</div>
						<div>
							<Image
								src={comm3}
								alt="commissioner 3"
								className="mx-auto"
							/>
							<div className="text-[17.7px] leading-[24px] text-center">
								<h1 className="text-[#000000]">
									Hon. Olatunde Azeez Osunbiyi
								</h1>
								<h1 className="text-[#3B8501] uppercase font-bold mt-[8px]">
									Commissioner III
								</h1>
							</div>
						</div>
						<div className="mt-[50px] md:mt-0">
							<Image
								src={comm4}
								alt="commissioner 4"
								className="mx-auto"
							/>
							<div className="text-[17.7px] leading-[24px] text-center">
								<h1 className="text-[#000000]">
									Alhaji Olatunde Rasak Rufai
								</h1>
								<h1 className="text-[#3B8501] uppercase font-bold mt-[8px]">
									Commissioner Iv
								</h1>
							</div>
						</div>
					</div>

					<div className="w-fit mx-auto my-[50px] md:my-[22px]">
						<Image
							src={perm}
							alt="permanent secretary"
							className="mx-auto"
						/>
						
						<div className="text-[17.7px] leading-[24px] text-center">
							<h1 className="text-[#000000]">
								Engr. Olanike Ogunbona
							</h1>
							<h1 className="text-[#3B8501] uppercase font-bold mt-[8px]">
								PERMANENT SECRETARY
							</h1>
						</div>

						<div className="mt-[26px] md:mt-[22px]">
							<h1 className="text-[#000000] text-[14px] md:text-[20px] font-bold uppercase">
								MAKE YOUR VOTE COUNT,
							</h1>
							<h1 className="text-[#3b8501] text-[14px] md:text-[20px] font-bold uppercase">
								FOLLOW THE INSTRUCTION CAREFULLY
							</h1>
							<p className="text-[#343434] text-[11px] md:text-[14px] mt-[12px] max-w-[600px] mx-auto leading-[20px] md:leading-[24px]">
								Follow the voting rules carefully. The system is designed to ensure that your vote counts. Every stage of the voting process needs to be followed. A detailed instruction on how to vote is provided below.
							</p>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
};

export default OfficialsMobile;