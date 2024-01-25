import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header/Header";
import Provider from "./SessionProvider";
import Footer from "@/components/Footer/Footer";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Johans sports apparel",
  description: "Get sporty",
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
          <main className='p-4 w-full min-h-screen m-auto min-w-[300px]'>
            {children}
          </main>
          <Footer />
        </Provider>
      </body>
    </html>
  );
}
