import type { Metadata } from "next";
import { Inter, Gafata } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap" });
const gafata = Gafata({ weight: ["400"], subsets: ["latin"], display: "swap", variable: "--font-gafata" });

export const metadata: Metadata = {
  title: "OSLGSC VOTING",
  description: "Ogun State Local Government Service Award Voting Platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${gafata.variable}`}>
        <link rel="icon" href="/logo.svg" sizes="any" />
        {children}
      </body>
    </html>
  );
}
