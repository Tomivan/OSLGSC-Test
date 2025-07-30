"use client";
import React, { useState, useEffect } from "react";

const Timer = () => {
	const [timeLeft, setTimeLeft] = useState({
		days: 27,
		hours: 14,
		minutes: 9,
		seconds: 59,
	});
	useEffect(() => {
		const timer = setInterval(() => {
			setTimeLeft((prev) => {
				if (prev.seconds > 0) {
					return { ...prev, seconds: prev.seconds - 1 };
				} else if (prev.minutes > 0) {
					return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
				} else if (prev.hours > 0) {
					return {
						...prev,
						hours: prev.hours - 1,
						minutes: 59,
						seconds: 59,
					};
				} else if (prev.days > 0) {
					return {
						...prev,
						days: prev.days - 1,
						hours: 23,
						minutes: 59,
						seconds: 59,
					};
				}
				return prev;
			});
		}, 1000);

		return () => clearInterval(timer);
	}, []);
	return (
		<main>
			<section>
				<div className="bg-[#FAFAFA] time rounded-[8px] md:w-[375px] mx-auto py-[20px]">
					<p className="text-center text-[24.4px] text-[#343434]">
						VOTE STARTS IN
					</p>
					<div className="flex items-center justify-center gap-4 text-[47px] md:text-[42.36px] text-[#3B8501]">
						<div className="flex flex-col items-center">
							<span className="gafata text2 tracking-[7%] text-[42px] leading-[50px] ">
								{timeLeft.days.toString().padStart(2, "0")}
							</span>
							<span className="gafata text2 tracking-[7%] text-[15px] ">
								days
							</span>
						</div>
						<span className="gafata text2 tracking-[7%] text-[21px] ">
							:
						</span>
						<div className="flex flex-col items-center">
							<span className="gafata text2 tracking-[7%] text-[42px] leading-[50px] ">
								{timeLeft.hours.toString().padStart(2, "0")}
							</span>
							<span className="gafata text2 tracking-[7%] text-[15px] ">
								hours
							</span>
						</div>
						<span className="gafata text2 tracking-[7%] text-[21px] ">
							:
						</span>
						<div className="flex flex-col items-center">
							<span className="gafata text2 tracking-[7%] text-[42px] leading-[50px] ">
								{timeLeft.minutes.toString().padStart(2, "0")}
							</span>
							<span className="gafata text2 tracking-[7%] text-[15px] ">
								minutes
							</span>
						</div>
						<span className="gafata text2 tracking-[7%] text-[21px] ">
							:
						</span>
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
