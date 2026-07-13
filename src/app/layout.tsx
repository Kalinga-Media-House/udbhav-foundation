import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://udbhavfoundation.in"),
  title: {
    default: "UDBHAV Foundation | Growing Together for an Inclusive Future",
    template: "%s | UDBHAV Foundation",
  },
  description:
    "UDBHAV Foundation is a community-rooted nonprofit organization working in education, environment, mental well-being, inclusion and community empowerment.",
  keywords: [
    "UDBHAV Foundation",
    "UDBHAV Foundation Odisha",
    "NGO in Bhubaneswar",
    "nonprofit organization Odisha",
    "education NGO Odisha",
    "environment NGO Odisha",
    "volunteer opportunities Bhubaneswar",
    "community development Odisha",
  ],
  applicationName: "UDBHAV Foundation",
  authors: [{ name: "UDBHAV Foundation", url: "https://udbhavfoundation.in" }],
  creator: "UDBHAV Foundation",
  publisher: "UDBHAV Foundation",
  openGraph: {
    title: "UDBHAV Foundation | Growing Together for an Inclusive Future",
    description:
      "A community-rooted nonprofit creating meaningful change through education, environmental responsibility, mental well-being, inclusion and collective action.",
    url: "https://udbhavfoundation.in",
    siteName: "UDBHAV Foundation",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "UDBHAV Foundation | Growing Together for an Inclusive Future",
    description:
      "A community-rooted nonprofit creating meaningful change through education, environmental responsibility, mental well-being, inclusion and collective action.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-warm-white text-text-primary font-body">
        <Header />
        <div className="flex-1 flex flex-col">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
