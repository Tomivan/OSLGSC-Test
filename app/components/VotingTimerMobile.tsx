"use client";
import React, { useState, useEffect } from "react";

const VotingTimerMobile = () => {
	const calculateTimeLeft = () => {
		// Voting period: Monday, Oct 13, 2025, 8:00 AM — Nov 12, 2025, 11:59 PM
		const voteStart = new Date("2025-10-13T08:00:00");
		const voteEnd = new Date("2025-11-12T23:59:00");
		const now = new Date();

		let difference;

		if (now < voteStart) {
			// Before voting starts
			difference = voteStart.getTime() - now.getTime();
		} else if (now >= voteStart && now <= voteEnd) {
			// During voting period
			difference = voteEnd.getTime() - now.getTime();
		} else {
			// After voting ends
			difference = 0;
		}

		let timeLeft = {
			days: 0,
			hours: 0,
			minutes: 0,
			seconds: 0,
		};

		if (difference > 0) {
			timeLeft = {
				days: Math.floor(difference / (1000 * 60 * 60 * 24)),
				hours: Math.floor(
					(difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
				),
				minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
				seconds: Math.floor((difference % (1000 * 60)) / 1000),
			};
		}

		return timeLeft;
	};

	const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
	const [phase, setPhase] = useState("before"); // 'before', 'during', or 'after'

	useEffect(() => {
		const updateTimer = () => {
			const now = new Date();
			const voteStart = new Date("2025-10-13T08:00:00");
			const voteEnd = new Date("2025-11-12T23:59:00");

			if (now < voteStart) {
				setPhase("before");
			} else if (now >= voteStart && now <= voteEnd) {
				setPhase("during");
			} else {
				setPhase("after");
			}

			setTimeLeft(calculateTimeLeft());
		};

		updateTimer();
		const timer = setInterval(updateTimer, 1000);
		return () => clearInterval(timer);
	}, []);

	const getLabel = () => {
		if (phase === "before") return "VOTING STARTS IN";
		if (phase === "during") return "VOTING ENDS IN";
		return "VOTING CLOSED";
	};

	return (
		<main className="mt-[200px] flex justify-center">
			<section>
				<div className="bg-[#AAAAAA38] backdrop-blur-md rounded-[8px] md:w-[375px] mx-auto px-[18px] py-[18px] border border-transparent [border-image:linear-gradient(100.4deg,#FF0000_30.66%,#FFA700_71.98%,#FB00FF_111.31%)_1]">
					<p className="text-center text-[20px] text-[#343434] font-semibold">
						{getLabel()}
					</p>

					{phase !== "after" ? (
						<div className="flex items-center justify-center gap-2 text-[#3B8501]">
							{["days", "hours", "minutes", "seconds"].map((unit, i) => (
								<React.Fragment key={unit}>
									<div className="flex flex-col items-center">
										<span className="gafata text2 tracking-[7%] text-[32px] leading-[50px]">
											{timeLeft[unit as keyof typeof timeLeft]
												.toString()
												.padStart(2, "0")}
										</span>
										<span className="gafata text2 tracking-[7%] text-[15px]">
											{unit}
										</span>
									</div>
									{i < 3 && (
										<span className="gafata text2 tracking-[7%] text-[21px]">
											:
										</span>
									)}
								</React.Fragment>
							))}
						</div>
					) : (
						<p className="text-center text-[18px] text-red-600 mt-2 font-medium">
							Voting has ended.
						</p>
					)}
				</div>
			</section>
		</main>
	);
};

export default VotingTimerMobile;
