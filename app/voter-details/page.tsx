"use client";

import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PaystackButton } from 'react-paystack';
import Navbar from "../components/Navbar";

interface FormData {
  email: string;
}

const VoterDetails = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const votes = searchParams.get('votes') || '0';
  const totalVotes = parseInt(votes);
  const paymentAmount = totalVotes * 100;

  const [formData, setFormData] = useState<FormData>({ email: '' });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const processVotes = (transaction: any) => {
    setIsProcessing(false);
    router.push('/vote-completed');
  };

  const paystackConfig = {
    email: formData.email,
    amount: paymentAmount * 100, 
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '',
    text: isProcessing ? "Processing..." : `Pay ₦${paymentAmount.toLocaleString()}`,
    onSuccess: (transaction: any) => {
      setIsProcessing(true);
      processVotes(transaction);
    },
    onClose: () => {
      console.log('Payment window closed');
      setIsProcessing(false);
    },
    onError: (error: Error) => {
      console.error('Paystack Error:', error);
      alert(`Payment error: ${error.message || 'Unknown error occurred'}`);
      setIsProcessing(false);
    },
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="w-full max-w-md absolute top-1/2 left-1/2 -translate-x-2/4 -translate-y-2/4 px-6">
        <div className="bg-gray-100 rounded-lg w-60 ml-12 p-6 mb-8">
          <div className="mb-2">
            <p className="text-[#3B8501] font-bold text-lg">
              VOTES: <span className="text-[#3B8501] font-bold text-2xl">{totalVotes}</span>
            </p>
          </div>
          <div>
            <p className="text-[#3B8501] font-bold text-lg">
              TO PAY: <span className="text-[#3B8501] font-bold text-2xl">₦{paymentAmount}</span>
            </p>
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
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Type here"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B8501] focus:border-transparent text-gray-600 placeholder-gray-400"
            />
          </div>
        </div>

        {formData.email ? (
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
            ENTER EMAIL TO PAY
          </button>
        )}
      </div>
    </div>
  );
};

export default VoterDetails;