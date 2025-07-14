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
				<div className="bg-gray-100 rounded-[8px] mt-[7px] px-6 py-4">
					<p className="text-center text-gray-600 font-semibold mb-3">
						VOTE STARTS IN
					</p>
					<div className="flex justify-center items-center space-x-4">
						<div className="text-center">
							<div className="text-2xl font-bold text-[#3B8501]">
								{timeLeft.days.toString().padStart(2, "0")}
							</div>
							<div className="text-xs text-gray-500">days</div>
						</div>
						<div className="text-[#3B8501] text-xl font-bold">
							:
						</div>
						<div className="text-center">
							<div className="text-2xl font-bold text-[#3B8501]">
								{timeLeft.hours.toString().padStart(2, "0")}
							</div>
							<div className="text-xs text-gray-500">hours</div>
						</div>
						<div className="text-[#3B8501] text-xl font-bold">
							:
						</div>
						<div className="text-center">
							<div className="text-2xl font-bold text-[#3B8501]">
								{timeLeft.minutes.toString().padStart(2, "0")}
							</div>
							<div className="text-xs text-gray-500">minutes</div>
						</div>
						<div className="text-[#3B8501] text-xl font-bold">
							:
						</div>
						<div className="text-center">
							<div className="text-2xl font-bold text-[#3B8501]">
								{timeLeft.seconds.toString().padStart(2, "0")}
							</div>
							<div className="text-xs text-gray-500">seconds</div>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
};

export default Timer;
