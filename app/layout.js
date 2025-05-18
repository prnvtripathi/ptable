import { Inter } from "next/font/google";
import "./globals.css";

export const metadata = {
  title: "Periodic Table",
  description: "Explore the periodic table of elements with detailed information and visualizations.",
};

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
