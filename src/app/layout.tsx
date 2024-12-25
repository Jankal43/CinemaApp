import "./globals.css";
import Header from "@/app/header";
import Footer from "@/app/footer";

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body>
        <Header />
        {children}
        <Footer />
        </body>
        </html>
    );
}
