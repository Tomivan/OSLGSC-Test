"use client";
import React, { useState, useEffect } from "react";

const VotingTimer = () => {
	const startDate = new Date("2025-10-13T08:00:00"); // Voting starts
	const endDate = new Date("2025-11-12T23:59:59"); // Voting ends

	const [timeLeft, setTimeLeft] = useState({
		days: 0,
		hours: 0,
		minutes: 0,
		seconds: 0,
		status: "before", // before | active | ended
	});

	useEffect(() => {
		const updateTimer = () => {
			const now = new Date();

			if (now < startDate) {
				setTimeLeft((prev) => ({ ...prev, status: "before" }));
				return;
			}

			if (now > endDate) {
				setTimeLeft((prev) => ({ ...prev, status: "ended" }));
				return;
			}

			const difference = endDate.getTime() - now.getTime();

			const days = Math.floor(difference / (1000 * 60 * 60 * 24));
			const hours = Math.floor(
				(difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
			);
			const minutes = Math.floor(
				(difference % (1000 * 60 * 60)) / (1000 * 60)
			);
			const seconds = Math.floor((difference % (1000 * 60)) / 1000);

			setTimeLeft({ days, hours, minutes, seconds, status: "active" });
		};

		updateTimer();
		const timer = setInterval(updateTimer, 1000);
		return () => clearInterval(timer);
	}, []);

	return (
		<main>
			<section>
				<div className="bg-[#FAFAFA] time rounded-[8px] md:w-[375px] mx-auto py-[20px]">
					{timeLeft.status === "before" && (
						<p className="text-center text-[24px] text-[#343434]">
							VOTING STARTS ON OCT 13, 8:00AM
						</p>
					)}

					{timeLeft.status === "ended" && (
						<p className="text-center text-[24px] text-[#343434]">
							VOTING HAS ENDED
						</p>
					)}

					{timeLeft.status === "active" && (
						<>
							<p className="text-center text-[24.4px] text-[#343434]">
								VOTE ENDS IN
							</p>
							<div className="flex items-center justify-center gap-4 text-[47px] md:text-[42.36px] text-[#3B8501]">
								{/* Days */}
								<div className="flex flex-col items-center">
									<span className="gafata text2 tracking-[7%] text-[42px] leading-[50px] ">
										{timeLeft.days.toString().padStart(2, "0")}
									</span>
									<span className="gafata text2 tracking-[7%] text-[15px] ">
										days
									</span>
								</div>
								<span className="gafata text2 text-[21px]">:</span>

								{/* Hours */}
								<div className="flex flex-col items-center">
									<span className="gafata text2 tracking-[7%] text-[42px] leading-[50px] ">
										{timeLeft.hours.toString().padStart(2, "0")}
									</span>
									<span className="gafata text2 tracking-[7%] text-[15px] ">
										hours
									</span>
								</div>
								<span className="gafata text2 text-[21px]">:</span>

								{/* Minutes */}
								<div className="flex flex-col items-center">
									<span className="gafata text2 tracking-[7%] text-[42px] leading-[50px] ">
										{timeLeft.minutes.toString().padStart(2, "0")}
									</span>
									<span className="gafata text2 tracking-[7%] text-[15px] ">
										minutes
									</span>
								</div>
								<span className="gafata text2 text-[21px]">:</span>

								{/* Seconds */}
								<div className="flex flex-col items-center">
									<span className="gafata text2 tracking-[7%] text-[42px] leading-[50px] ">
										{timeLeft.seconds.toString().padStart(2, "0")}
									</span>
									<span className="gafata text2 tracking-[7%] text-[15px] ">
										seconds
									</span>
								</div>
							</div>
						</>
					)}
				</div>
			</section>
		</main>
	);
};

export default VotingTimer;
