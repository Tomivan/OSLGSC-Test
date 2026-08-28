import Image from "next/image";
import React from "react";
import chairw from "../assets/chairw.svg";
import comm1 from "../assets/comm1.svg";
import comm2 from "../assets/comm2.png";
import comm3 from "../assets/comm3.png";
import comm4 from "../assets/comm4.png";
import perm from "../assets/perm.png";

const Officials = () => {
  return (
    <main className="flex justify-center mt-[20px] md:mt-[50px] md:mb-[80px]">
      <section className="md:w-full w-[90%] md:max-w-[1280px] flex justify-center items-center">
        <div className="w-full">
			<div className="w-fit mx-auto mb-[50px] md:mb-[40px] flex justify-between pb-4">
				<div>
					<Image src={chairw} alt="Chairperson" className="" />
					<div className="text-[17.7px] leading-[24px] text-center">
						<p className="text-[#000000] font-semibold">
							Ms. Olivia Olubukunola Onabanjo
						</p>
						<p className="text-[#3B8501] uppercase font-bold mt-[8px]">
							CHAIRMAN
						</p>
					</div>
				</div>
            
				<div className="mt-[30px] max-w-[800px] mx-auto pl-40">
				<h2 className="uppercase font-bold text-xl md:text-3xl mb-4">
					VOTING IS NOW OPEN
				</h2>
				<h2 className="text-[#3B8501] uppercase font-bold text-xl md:text-3xl mb-4">
					LET YOUR VOICE BE HEARD!
				</h2>
				<p className="text-[#343434] text-sm md:text-base leading-[1.6] max-w-[700px] mx-auto">
					Explore the inspiring nominations, learn about the remarkable <br />
					initiatives and dedication of your colleagues, friends, and 
					family, <br /> and cast your vote for those who best embody the spirit 
					of <br /> public service.
				</p>
				<p className="text-[#343434] text-sm md:text-base leading-[1.6] max-w-[700px] mx-auto mt-4">
					Thank you for joining this special recognition event. Your <br />
					participation helps ensure deserving efforts are celebrated and  <br />
					supports a continued culture of dedication and innovation within  <br />
					the Local Government Service Commission.
				</p>
				</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 w-full mx-auto md:gap-[34px] gap-[30px]">
            <div>
              <Image
                src={comm1}
                alt="commissioner 1"
                className="w-full"
              />
              <div className="text-[17.7px] leading-[24px] text-center">
                <p className="text-[#000000] font-semibold">
                  Hon. Lukmon Olufemi Adiro
                </p>
                <p className="text-[#3B8501] uppercase font-bold mt-[8px]">
                  Commissioner I
                </p>
              </div>
            </div>
            
            <div>
              <Image
                src={comm2}
                alt="commissioner 2"
                className="w-full"
              />
              <div className="text-[17.7px] leading-[24px] text-center">
                <p className="text-[#000000] font-semibold">
                  Hon. Koye Ijaduoye
                </p>
                <p className="text-[#3B8501] uppercase font-bold mt-[8px]">
                  Commissioner II
                </p>
              </div>
            </div>
            
            <div>
              <Image
                src={comm3}
                alt="commissioner 3"
                className="w-full"
              />
              <div className="text-[17.7px] leading-[24px] text-center">
                <p className="text-[#000000] font-semibold">
                  Hon. Olatunde Azeez Osunbiyi
                </p>
                <p className="text-[#3B8501] uppercase font-bold mt-[8px]">
                  Commissioner III
                </p>
              </div>
            </div>
            
            <div>
              <Image
                src={comm4}
                alt="commissioner 4"
                className="w-full"
              />
              <div className="text-[17.7px] leading-[24px] text-center">
                <p className="text-[#000000] font-semibold">
                  Alhaji Olatunde Rasak Rufai
                </p>
                <p className="text-[#3B8501] uppercase font-bold mt-[8px]">
                  Commissioner IV
                </p>
              </div>
            </div>
          </div>

          <div className="w-fit pt-4 my-[50px] md:my-[40px] flex justify-between">
			<div className="mt-[30px] max-w-[800px] pl-20 mx-auto">
				<h2 className="uppercase font-bold text-xl md:text-3xl mb-4">
					MAKE YOUR VOTE COUNT,
				</h2>
				<h2 className="text-[#3B8501] uppercase font-bold text-xl md:text-3xl mb-4">
					FOLLOW THE INSTRUCTION <br />CAREFULLY
				</h2>
				<p className="text-[#343434] text-sm md:text-base leading-[1.6] max-w-[700px] mx-auto">
					Follow the voting rules carefully. The system is designed to 
					ensure that <br /> your vote counts. Every stage of the voting process 
					needs to be <br /> followed. A detailed instruction on how to vote is 
					provided below.
				</p>
            </div>
			<div className="pl-72">
				<Image
				src={perm}
				alt="permanent secretary"
				className="w-full"
				/>
				<div className="text-[17.7px] leading-[24px] text-center">
					<p className="text-[#000000] font-semibold">
						Engr. Olanike Ogunbona
					</p>
					<p className="text-[#3B8501] uppercase font-bold mt-[8px]">
						PERMANENT SECRETARY
					</p>
				</div>
			</div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Officials;