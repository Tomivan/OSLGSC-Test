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
		<main className="flex justify-center mt-[20px] md:mt-[50px] md:mb-[80px] ">
			<section className="md:w-full w-[90%] md:max-w-[1280px] flex justify-center items-center ">
				<div>
					<div className="w-fit mx-auto mb-[50px] md:mb-[22px] ">
						<Image src={chairw} alt="Chairperson" className="" />
						<div className=" text-[17.7px] leading-[24px] text-center ">
							<h1 className="text-[#000000]">
								Ms. Olivia Olubukunola Onabanjo
							</h1>
							<h1 className="text-[#3B8501] uppercase font-bold mt-[8px] ">
								Chairman
							</h1>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-4 w-fit mx-auto md:gap-[34px] ">
						<div>
							<Image
								src={comm1}
								alt="commissioner 1"
								className=""
							/>
							<div className=" text-[17.7px] leading-[24px] text-center ">
								<h1 className="text-[#000000]">
									Hon. Lukmon Olufemi Adiro
								</h1>
								<h1 className="text-[#3B8501] uppercase font-bold mt-[8px] ">
									Commissioner I
								</h1>
							</div>
						</div>
						<div className="md:my-0 my-[50px] ">
							<Image
								src={comm2}
								alt="commissioner 2"
								className=""
							/>
							<div className=" text-[17.7px] leading-[24px] text-center ">
								<h1 className="text-[#000000]">
									Hon. Koye Ijaduoye
								</h1>
								<h1 className="text-[#3B8501] uppercase font-bold mt-[8px] ">
									Commissioner II
								</h1>
							</div>
						</div>
						<div>
							<Image
								src={comm3}
								alt="commissioner 3"
								className=""
							/>
							<div className=" text-[17.7px] leading-[24px] text-center ">
								<h1 className="text-[#000000]">
									Hon. Olatunde Azeez Osunbiyi
								</h1>
								<h1 className="text-[#3B8501] uppercase font-bold mt-[8px] ">
									Commissioner III
								</h1>
							</div>
						</div>
						<div className="mt-[50px] md:mt-0 ">
							<Image
								src={comm4}
								alt="commissioner 4"
								className=""
							/>
							<div className=" text-[17.7px] leading-[24px] text-center ">
								<h1 className="text-[#000000]">
									Alhaji Olatunde Rasak Rufai
								</h1>
								<h1 className="text-[#3B8501] uppercase font-bold mt-[8px] ">
									Commissioner Iv
								</h1>
							</div>
						</div>
					</div>
					<div className="w-fit mx-auto my-[50px] md:my-[22px] ">
						<Image
							src={perm}
							alt="permanent secretary"
							className=""
						/>
						<div className=" text-[17.7px] leading-[24px] text-center ">
							<h1 className="text-[#000000]">
								Engr. Olanike Ogunbona
							</h1>
							<h1 className="text-[#3B8501] uppercase font-bold mt-[8px] ">
								Permanent Secretary
							</h1>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
};

export default Officials;
