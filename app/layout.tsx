import type { Metadata } from "next";
import { DM_Sans, Libre_Caslon_Display } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const libreCaslon = Libre_Caslon_Display({
  variable: "--font-libre-caslon",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: {
    default: "Rolls-Royce Enthusiasts' Club",
    template: "%s | RREC",
  },
  description:
    "The international club for Rolls-Royce and Bentley enthusiasts — owners and non-owners alike, since 1957.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${dmSans.variable} ${libreCaslon.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
