import "./globals.css";
import Header from "@/app/header";
import Footer from "@/app/footer";
import { Inter } from "next/font/google";

const inter = Inter({ 
    subsets: ["latin"],
    variable: "--font-inter",
});

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={inter.variable}>
        <body>
        <Header />
        {children}
        <Footer />
        </body>
        </html>
    );
}
