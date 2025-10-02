import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { getProfile } from "@/features/auth/hooks/actions";
import Navbar from "@/components/page/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Gym App",
  description: "The Best Gym In The World.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const data = await getProfile();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers data={data}>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
