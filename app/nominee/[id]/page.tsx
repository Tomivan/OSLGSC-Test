// app/nominee/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { NomineeDetailPage } from "../../components/NomineeDetail";

interface NomineeData {
  id: string;
  name: string;
  image: string;
  voteCount: number;
  category: string;
  categoryId: string;
  bio?: string;
}

export default function NomineePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const nomineeId = params.id as string;
  const categoryId = searchParams.get("category") || "";
  
  const [nominee, setNominee] = useState<NomineeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNominee = async () => {
      try {
        setLoading(true);
        const nomineeRef = doc(db, "contestants", nomineeId);
        const nomineeSnap = await getDoc(nomineeRef);

        if (nomineeSnap.exists()) {
          const data = nomineeSnap.data();
          
          setNominee({
            id: nomineeSnap.id,
            name: data.name || "Unknown",
            image: data.imageUrl || "/image.png", 
            voteCount: data.votes || 0,
            category: data.category || "Unknown Category", 
            categoryId: categoryId, 
            bio: data.bio || data.description || "",
          });
        } else {
          setError("Nominee not found");
        }
      } catch (err) {
        console.error("Error fetching nominee:", err);
        setError("Failed to load nominee details");
      } finally {
        setLoading(false);
      }
    };

    if (nomineeId) {
      fetchNominee();
    }
  }, [nomineeId, categoryId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#3B8501] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading nominee details...</p>
        </div>
      </div>
    );
  }

  if (error || !nominee) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-lg shadow-lg p-8 max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error || "Nominee not found"}</p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-2 bg-[#3B8501] hover:bg-[#2d6601] text-white font-semibold rounded-lg transition-colors duration-200"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return <NomineeDetailPage nominee={nominee} />;
}