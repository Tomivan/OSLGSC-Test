"use client";

import React, { useState, Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Navbar from "../../components/Navbar";
import { useVote } from "../../context/VoteContext";

// Dynamically import PaystackButton to avoid SSR issues
const PaystackButton = dynamic(
	() => import("react-paystack").then((mod) => mod.PaystackButton),
	{ ssr: false }
);

interface VoterFormData {
	email?: string; 
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
	const router = useRouter();
	const { totalVotes, resetVotes, syncWithFirebase } = useVote();
	const paymentAmount = totalVotes * 100;

	const [formData, setFormData] = useState<VoterFormData>({ email: "" });
	const [isProcessing, setIsProcessing] = useState(false);
	const [isClient, setIsClient] = useState(false);
	const [paymentSuccess, setPaymentSuccess] = useState(false);

	useEffect(() => {
		setIsClient(true);
	}, []);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const processVotes = async (transaction: PaystackTransaction) => {
		console.log("Payment successful:", transaction.reference);
		setIsProcessing(false);
		setPaymentSuccess(true);
		
		try {
			// Sync votes to Firebase after successful payment
			await syncWithFirebase();
			
			// Reset local votes and redirect
			await resetVotes();
			router.push("/vote-completed");
		} catch (error) { // eslint-disable-line @typescript-eslint/no-explicit-any
			console.log(error)
			alert("Payment successful but failed to update votes. Please contact support.");
		}
	};

	const paystackConfig = {
		email: formData.email || "voter@example.com", 
		amount: paymentAmount * 100, // convert to kobo for Paystack
		publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "",
		metadata: {
			voteData: {
			totalVotes: totalVotes,
			timestamp: new Date().toISOString(),
			email: formData.email || "anonymous",
			},
			// Keep custom_fields for Paystack dashboard display
			custom_fields: [
			{
				display_name: "Vote Data",
				variable_name: "vote_data",
				value: `${totalVotes} votes`
			}
			]
		},
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
			alert(
				`Payment error: ${error.message || "Unknown error occurred"}`
			);
			setIsProcessing(false);
		},
	};

	// Check if payment can proceed (has votes and client is ready)
	const canProceedToPayment = totalVotes > 0 && isClient;

	return (
		<div className="min-h-screen bg-white">
			<Navbar />
			<div className="w-full max-w-md absolute top-1/2 left-1/2 -translate-x-2/4 -translate-y-2/4 px-6">
				<div className="bg-[#AAAAAA38] time rounded-lg w-[175px] mx-auto p-[15px] mb-8">
					<div className="mb-2 w-fit mx-auto ">
						<p className="text-[#3B8501] tracking-[1%] font-bold text-[24px]">
							VOTES:{" "}
							<span className="text-[#3B8501] font-bold text-2xl">
								{paymentSuccess ? 0 : totalVotes}
							</span>
						</p>
					</div>
					<div className="tracking-[1%] w-fit mx-auto">
						<p className="text-[#3B8501]  font-bold">
							TO PAY:{" "}
							<span className="text-[#3B8501] ml-[5px] font-semibold">
								₦{paymentSuccess ? 0 : paymentAmount}
							</span>
						</p>
					</div>
				</div>

				{!paymentSuccess ? (
				<>
					<div className="space-y-4">
					<div>
						<label className="block text-[#666666] text-xs font-semibold mb-2">
						Email Address (Optional)
						</label>
						<input
						type="email"
						name="email"
						value={formData.email}
						onChange={handleChange}
						placeholder="Type here"
						className="w-full px-4 py-3 border border-[#CCCCCC] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B8501] focus:border-transparent text-gray-600 placeholder-gray-400"
						/>
					</div>
					</div>

					{canProceedToPayment ? (
					<PaystackButton
						{...paystackConfig}
						className="w-full bg-[#3B8501] hover:bg-[#2d6801] text-white font-bold py-4 rounded-lg mt-8 transition-colors duration-200 uppercase tracking-wide disabled:opacity-50"
					/>
					) : (
					<button
						className="w-full bg-gray-400 text-white font-bold py-4 rounded-lg mt-8 uppercase tracking-wide cursor-not-allowed"
						disabled
					>
						{totalVotes === 0 ? "NO VOTES TO PAY FOR" : "LOADING..."}
					</button>
					)}
				</>
				) : (
				<div className="text-center py-8">
					<p className="text-[#3B8501] font-bold text-lg">
					Payment successful! Redirecting...
					</p>
				</div>
				)}
				<p className="text-red-500 text-sm mb-6 mt-8 font-medium">
					Kindly return to the application to ensure your payment is confirmed
				</p>
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