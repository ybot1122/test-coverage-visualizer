import type { Metadata } from "next";
import { Cousine } from "next/font/google";
import "./globals.css";
import CoverageDataContextProvider from "@/components/CoverageDataContext";
import { CoverageJSON } from "@/types/CoverageSummary";
import { CoverageMap } from "@/types/CoverageMap";
import { getCoverageData } from "@/utils/getCoverageData";

const font = Cousine({
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Test Coverage Report",
  description:
    "Given a coverage report, visualize the source code with coverage highlighting.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const data = getCoverageData();
  const { summary, coverage } = data;

  return (
    <html lang="en">
      <body className={`${font.className} antialiased`}>
        <CoverageDataContextProvider
          value={{
            summary: summary as CoverageJSON,
            coverageMap: coverage as Record<string, CoverageMap>,
          }}
        >
          {children}
        </CoverageDataContextProvider>
      </body>
    </html>
  );
}
