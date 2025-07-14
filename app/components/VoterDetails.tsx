import React from "react";
import Image from "next/image";
import logo from "../assets/logo.svg";

const VoterDetails = () => {
	return (
		<main className="min-h-screen bg-white flex justify-center py-8">
			<div className="w-full max-w-md px-6">
				<div className="text-center mb-8">
					<Image
						src={logo}
						alt="OSLGSC Logo"
						className="mx-auto mb-4 w-16 h-16"
					/>
					<h1 className="font-bold text-lg uppercase text-[#343434] leading-tight">
						OGUN STATE LOCAL GOVERNMENT
						<br />
						SERVICE COMMISSION AWARD
					</h1>
				</div>

				<div className="bg-gray-100 rounded-lg p-6 mb-8 text-center">
					<div className="mb-2">
						<span className="text-[#3B8501] font-bold text-lg">
							VOTES:{" "}
						</span>
						<span className="text-[#3B8501] font-bold text-2xl">
							20
						</span>
					</div>
					<div>
						<span className="text-[#3B8501] font-bold text-lg">
							TO PAY:{" "}
						</span>
						<span className="text-[#3B8501] font-bold text-2xl">
							₦2000
						</span>
					</div>
				</div>

				<p className="text-[#343434] text-sm mb-6 font-medium">
					Kindly enter the following details to cast your votes:
				</p>

				<div className="space-y-4">
					<div>
						<label className="block text-[#343434] text-sm font-medium mb-2">
							Email Address*
						</label>
						<input
							required
							type="email"
							placeholder="Type here"
							className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B8501] focus:border-transparent text-gray-600 placeholder-gray-400"
						/>
					</div>
				</div>

				<button className="w-full bg-[#3B8501] hover:bg-[#2d6801] text-white font-bold py-4 rounded-lg mt-8 transition-colors duration-200 uppercase tracking-wide">
					PAY NOW
				</button>
			</div>
		</main>
	);
};

export default VoterDetails;
