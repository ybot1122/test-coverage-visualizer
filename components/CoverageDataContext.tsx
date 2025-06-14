"use client";
import { ReactNode } from "react";
import { CoverageMap } from "@/types/CoverageMap";
import { CoverageJSON } from "@/types/CoverageSummary";
import { createContext, useContext } from "react";

// Set up context shape
interface CoverageDataContextProps {
  summary?: CoverageJSON;
  coverageMap?: Record<string, CoverageMap>;
}

// Create context with default values (will be overridden by provider)
const CoverageDataContext = createContext<CoverageDataContextProps>({});

//  Provider

export default ({
  value,
  children,
}: {
  value: CoverageDataContextProps;
  children: ReactNode;
}) => (
  <CoverageDataContext.Provider value={value}>
    {children}
  </CoverageDataContext.Provider>
);

// Custom hook for easy usage
export const useCoverageData = () => useContext(CoverageDataContext);
