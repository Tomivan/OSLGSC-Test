// "use client";

// import { useState, useEffect } from "react";
// import {
// 	collection,
// 	query,
// 	onSnapshot,
// 	orderBy,
// 	doc,
// 	updateDoc,
// 	// increment,
// } from "firebase/firestore";
// import { db } from "../lib/firebase";
// import { Category, Nominee } from "../types";

// // Hook to fetch categories
// export const useCategories = () => {
// 	const [categories, setCategories] = useState<Category[]>([]);
// 	const [loading, setLoading] = useState(true);
// 	const [error, setError] = useState<string | null>(null);

// 	useEffect(() => {
// 		const q = query(collection(db, "categories"), orderBy("name"));

// 		const unsubscribe = onSnapshot(
// 			q,
// 			(querySnapshot) => {
// 				const categoriesData: Category[] = [];
// 				querySnapshot.forEach((doc) => {
// 					categoriesData.push({
// 						id: doc.id,
// 						...doc.data(),
// 						createdAt: doc.data().createdAt?.toDate() || new Date(),
// 					} as Category);
// 				});
// 				setCategories(categoriesData);
// 				setLoading(false);
// 			},
// 			(error) => {
// 				console.error("Error fetching categories:", error);
// 				setError("Failed to fetch categories");
// 				setLoading(false);
// 			}
// 		);

// 		return () => unsubscribe();
// 	}, []);

// 	return { categories, loading, error };
// };

// // Hook to fetch nominees by category
// export const useNominees = (categoryId: string | null) => {
// 	const [nominees, setNominees] = useState<Nominee[]>([]);
// 	const [loading, setLoading] = useState(true);
// 	const [error, setError] = useState<string | null>(null);

// 	useEffect(() => {
// 		if (!categoryId) {
// 			setNominees([]);
// 			setLoading(false);
// 			return;
// 		}

// 		const q = query(
// 			collection(db, "nominees"),
// 			orderBy("voteCount", "desc")
// 		);

// 		const unsubscribe = onSnapshot(
// 			q,
// 			(querySnapshot) => {
// 				const nomineesData: Nominee[] = [];
// 				querySnapshot.forEach((doc) => {
// 					const data = doc.data();
// 					if (data.categoryId === categoryId) {
// 						nomineesData.push({
// 							id: doc.id,
// 							...data,
// 							createdAt: data.createdAt?.toDate() || new Date(),
// 						} as Nominee);
// 					}
// 				});
// 				setNominees(nomineesData);
// 				setLoading(false);
// 			},
// 			(error) => {
// 				console.error("Error fetching nominees:", error);
// 				setError("Failed to fetch nominees");
// 				setLoading(false);
// 			}
// 		);

// 		return () => unsubscribe();
// 	}, [categoryId]);

// 	return { nominees, loading, error };
// };

// export const useVoting = () => {
// 	const [isVoting, setIsVoting] = useState(false);

// 	const updateVoteCount = async (nomineeId: string, increment: number) => {
// 		try {
// 			setIsVoting(true);
// 			const nomineeRef = doc(db, "nominees", nomineeId);
// 			await updateDoc(nomineeRef, {
// 				voteCount: increment(increment),
// 			});
// 		} catch (error) {
// 			console.error("Error updating vote count:", error);
// 			throw error;
// 		} finally {
// 			setIsVoting(false);
// 		}
// 	};

// 	return { updateVoteCount, isVoting };
// };
