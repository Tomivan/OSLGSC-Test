"use client";

import React from "react";
import Categories from "../components/Categories";

const TestPage = () => {
	return (
		<div className="min-h-screen bg-gray-100">
			<div className="container mx-auto py-8">
				<h1 className="text-3xl font-bold text-center mb-8">
					OSLGSC Voting - Development Test
				</h1>
				<Categories />
			</div>
		</div>
	);
};

export default TestPage;
