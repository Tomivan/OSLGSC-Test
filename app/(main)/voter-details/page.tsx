"use client";

import React, { useState, Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Navbar from "../../components/navbar/Navbar";
import { useVote } from "../../context/VoteContext";
import styles from "./VoterDetails.module.css";

const PaystackButton = dynamic(
  () => import("react-paystack").then((mod) => mod.PaystackButton),
  { ssr: false }
);

interface VoterFormData {
  email?: string;
}

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
      await syncWithFirebase();
      await resetVotes();
      router.push("/vote-completed");
    } catch (error) {
      console.log(error);
      alert("Payment successful but failed to update votes. Please contact support.");
    }
  };

  const paystackConfig = {
    email: formData.email || "voter@example.com",
    amount: paymentAmount * 100,
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "",
    metadata: {
      voteData: {
        totalVotes: totalVotes,
        timestamp: new Date().toISOString(),
        email: formData.email || "anonymous",
      },
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

  const canProceedToPayment = totalVotes > 0 && isClient;

  return (
    <div className={styles.pageContainer}>
      <Navbar />
      <div className={styles.contentContainer}>
        <div className={styles.voteSummary}>
          <div className={styles.voteSummaryItem}>
            <p className={styles.voteSummaryLabel}>
              VOTES:{" "}
              <span className={styles.voteSummaryValue}>
                {paymentSuccess ? 0 : totalVotes}
              </span>
            </p>
          </div>
          <div className={styles.voteSummaryItem}>
            <p className={styles.voteSummaryLabel}>
              TO PAY:{" "}
              <span className={styles.voteSummaryAmount}>
                ₦{paymentSuccess ? 0 : paymentAmount}
              </span>
            </p>
          </div>
        </div>

        {!paymentSuccess ? (
          <>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                Email Address (Optional)
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Type here"
                className={styles.formInput}
              />
            </div>

            {canProceedToPayment ? (
              <PaystackButton
                {...paystackConfig}
                className={styles.paystackButton}
              />
            ) : (
              <button
                className={styles.disabledButton}
                disabled
              >
                {totalVotes === 0 ? "NO VOTES TO PAY FOR" : "LOADING..."}
              </button>
            )}
          </>
        ) : (
          <div className={styles.successContainer}>
            <p className={styles.successText}>
              Payment successful! Redirecting...
            </p>
          </div>
        )}
        <p className={styles.returnNotice}>
          Kindly return to the application to ensure your payment is confirmed
        </p>
      </div>
    </div>
  );
};

const VoterDetails = () => {
  return (
    <Suspense fallback={<div className={styles.suspenseFallback}>Loading...</div>}>
      <VoterDetailsContent />
    </Suspense>
  );
};

export default VoterDetails;