"use client";
import React, { useState, useEffect } from "react";

const TimerMobile = () => {
	const calculateTimeLeft = () => {
		// Target date and time — Monday, October 13, 2025, 8:00 AM
		const targetDate = new Date("2025-10-13T08:00:00");
		const now = new Date();

		const difference = targetDate.getTime() - now.getTime();

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

	useEffect(() => {
		const timer = setInterval(() => {
			setTimeLeft(calculateTimeLeft());
		}, 1000);

		return () => clearInterval(timer);
	}, []);

	return (
		<main className="mt-[200px] flex justify-center">
			<section>
				<div className="bg-[#AAAAAA38] backdrop-blur-md rounded-[8px] md:w-[375px] mx-auto px-[18px] py-[18px] border border-transparent [border-image:linear-gradient(100.4deg,#FF0000_30.66%,#FFA700_71.98%,#FB00FF_111.31%)_1]">
					<p className="text-center text-[20px] text-[#343434]">
						VOTE STARTS IN
					</p>

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
				</div>
			</section>
		</main>
	);
};

export default TimerMobile;
