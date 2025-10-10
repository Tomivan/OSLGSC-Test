"use client";
import React, { useState, useEffect } from "react";

const TimerMobile = () => {
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
		<main className="mt-[200px] flex justify-center  ">
			<section>
				<div className="bg-[#AAAAAA38] time rounded-[8px] md:w-[375px] mx-auto px-[18px] py-[18px]">
					<p className="text-center text-[20px] text-[#343434]">
						VOTE STARTS IN
					</p>
					<div className="flex items-center justify-center gap-2 text-[32px]  text-[#3B8501]">
						<div className="flex flex-col items-center">
							<span className="gafata text2 tracking-[7%] text-[32px] leading-[50px] ">
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
							<span className="gafata text2 tracking-[7%] text-[32px] leading-[50px] ">
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
							<span className="gafata text2 tracking-[7%] text-[32px] leading-[50px] ">
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
							<span className="gafata text2 tracking-[7%] text-[32px] leading-[50px] ">
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

export default TimerMobile;