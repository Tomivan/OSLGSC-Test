"use client";

import React, { useState, Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Navbar from "../components/Navbar";

// Dynamically import PaystackButton to avoid SSR issues
const PaystackButton = dynamic(
	() => import("react-paystack").then((mod) => mod.PaystackButton),
	{ ssr: false }
);

interface VoterFormData {
	email: string;
}

// Define Paystack transaction interface
interface PaystackTransaction {
	reference: string;
	status: string;
	message: string;
	trans: string;
	transaction: string;
	trxref: string;
	redirecturl: string;
}

const VoterDetailsContent = () => {
	const searchParams = useSearchParams();
	const router = useRouter();
	const votes = searchParams.get("votes") || "0";
	const totalVotes = parseInt(votes);
	const paymentAmount = totalVotes * 100; // amount in Naira for display

	const [formData, setFormData] = useState<VoterFormData>({ email: "" });
	const [isProcessing, setIsProcessing] = useState(false);
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
	}, []);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const processVotes = (transaction: PaystackTransaction) => {
		console.log("Payment successful:", transaction.reference);
		setIsProcessing(false);
		router.push("/vote-completed");
	};

	const paystackConfig = {
		email: formData.email,
		amount: paymentAmount * 100, // convert to kobo for Paystack
		publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "",
		text: isProcessing
			? "Processing..."
			: `Pay ₦${paymentAmount.toLocaleString()}`,
		onSuccess: (transaction: PaystackTransaction) => {
			setIsProcessing(true);
			processVotes(transaction);
		},
		onClose: () => {
			console.log("Payment window closed");
			setIsProcessing(false);
		},
		onError: (error: Error) => {
			console.error("Paystack Error:", error);
			alert(
				`Payment error: ${error.message || "Unknown error occurred"}`
			);
			setIsProcessing(false);
		},
	};

	return (
		<div className="min-h-screen bg-white">
			<Navbar />
			<div className="w-full max-w-md absolute top-1/2 left-1/2 -translate-x-2/4 -translate-y-2/4 px-6">
				<div className="bg-[#AAAAAA38] time rounded-lg w-[175px] mx-auto p-[15px] mb-8">
					<div className="mb-2 w-fit mx-auto ">
						<p className="text-[#3B8501] tracking-[1%] font-bold text-[24px]">
							VOTES:{" "}
							<span className="text-[#3B8501] font-bold text-2xl">
								{totalVotes}
							</span>
						</p>
					</div>
					<div className="tracking-[1%] w-fit mx-auto">
						<p className="text-[#3B8501]  font-bold">
							TO PAY:{" "}
							<span className="text-[#3B8501] ml-[5px] font-semibold">
								₦{paymentAmount}
							</span>
						</p>
					</div>
				</div>

				<p className="text-[#343434] text-sm mb-6 font-medium">
					Kindly enter the following details to cast your votes:
				</p>

				<div className="space-y-4">
					<div>
						<label className="block text-[#666666] text-xs font-semibold mb-2">
							Email Address*
						</label>
						<input
							required
							type="email"
							name="email"
							value={formData.email}
							onChange={handleChange}
							placeholder="Type here"
							className="w-full px-4 py-3 border border-[#CCCCCC] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B8501] focus:border-transparent text-gray-600 placeholder-gray-400"
						/>
					</div>
				</div>
				{formData.email && isClient ? (
					<PaystackButton
						{...paystackConfig}
						className="w-full bg-[#3B8501] hover:bg-[#2d6801] text-white font-bold py-4 rounded-lg mt-8 transition-colors duration-200 uppercase tracking-wide disabled:opacity-50"
						disabled={isProcessing || !formData.email}
					/>
				) : (
					<button
						className="w-full bg-gray-400 text-white font-bold py-4 rounded-lg mt-8 uppercase tracking-wide cursor-not-allowed"
						disabled
					>
						{formData.email ? "Loading..." : "ENTER EMAIL TO PAY"}
					</button>
				)}
			</div>
		</div>
	);
};

const VoterDetails = () => {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<VoterDetailsContent />
		</Suspense>
	);
};

export default VoterDetails;
