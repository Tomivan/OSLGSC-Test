import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { VoteProvider } from "./context/VoteContext";

const rale = Inter({
	weight: ["400"],
	style: ["normal"],
	subsets: ["latin"],
	display: "swap",
});
export const metadata: Metadata = {
	title: "OSLGSC VOTING",
	description:
		"Ogun State Local Government Service Commission Award Voting Platform",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={rale.className}>
				<link rel="icon" href="/logo.svg" sizes="any" />
				<VoteProvider>{children}</VoteProvider>
			</body>
		</html>
	);
}
