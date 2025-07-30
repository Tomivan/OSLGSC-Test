import type { Metadata } from "next";
import { Inter, Gafata } from "next/font/google";
import "./globals.css";
import { VoteProvider } from "./context/VoteContext";

const inter = Inter({
	subsets: ["latin"],
});

export const gafata = Gafata({
	weight: ["400"],
	subsets: ["latin"],
	variable: "--font-gafata",
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
			<body className={`${inter.className} ${gafata.variable}`}>
				<link rel="icon" href="/logo.svg" sizes="any" />
				<VoteProvider>{children}</VoteProvider>
			</body>
		</html>
	);
}
