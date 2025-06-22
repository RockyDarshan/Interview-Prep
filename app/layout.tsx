import type { Metadata } from "next";
import { Mona_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const mona_Sans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "Prep_Next",
  description: "An AI powered platform for preparing for interviews",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
     <body
  className={`${mona_Sans.className} antialiased pattern min-h-screen flex items-center justify-center bg-gray-100 dark:bg-black`}
>
  {children}

  <Toaster />

</body>

    </html>
  );
}
