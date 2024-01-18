import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header/Header";
import Provider from "./SessionProvider";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Johans sports apparel",
  description: "Are you not entertained?",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <Provider>
          <Header />
          <main className='p-4 w-full m-auto min-w-[300px]'>{children}</main>
        </Provider>
      </body>
    </html>
  );
}
