"use client";
import React, { useState, useEffect, useMemo } from "react";

const Timer = () => {
	// Use useMemo to prevent targetDate from being recreated on every render
	const targetDate = useMemo(() => new Date("2025-11-12T08:23:59"), []);

	const [timeLeft, setTimeLeft] = useState({
		days: 0,
		hours: 0,
		minutes: 0,
		seconds: 0,
	});

	useEffect(() => {
		const updateTimer = () => {
			const now = new Date();
			const difference = targetDate.getTime() - now.getTime();

			if (difference <= 0) {
				setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
				return;
			}

			const days = Math.floor(difference / (1000 * 60 * 60 * 24));
			const hours = Math.floor(
				(difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
			);
			const minutes = Math.floor(
				(difference % (1000 * 60 * 60)) / (1000 * 60)
			);
			const seconds = Math.floor((difference % (1000 * 60)) / 1000);

			setTimeLeft({ days, hours, minutes, seconds });
		};

		updateTimer(); // run immediately on mount
		const timer = setInterval(updateTimer, 1000);

		return () => clearInterval(timer);
	}, [targetDate]); // targetDate is now stable

	return (
		<main>
			<section>
				<div className="bg-[#FAFAFA] time rounded-[8px] md:w-[375px] mx-auto py-[20px]">
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
				</div>
			</section>
		</main>
	);
};

export default Timer;