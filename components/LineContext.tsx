import { LineStatus } from "@/utils/getStatementsStatus";
import { createContext, ReactNode, useContext, useState } from "react";

// Set up context shape
interface LineInfoProps {
  lineInfo: LineStatus | undefined;
  setLineInfo: (lineInfo: LineStatus | undefined) => void;
}

// Create context with default values (will be overridden by provider)
const LineContext = createContext<LineInfoProps>({
  lineInfo: undefined,
  setLineInfo: () => {},
});

// Provider component
export const LineContextProvider = ({ children }: { children: ReactNode }) => {
  const [info, setInfo] = useState<LineStatus>();

  const setLineInfo = (status: LineStatus | undefined) => {
    setInfo(status);
  };

  return (
    <LineContext.Provider value={{ lineInfo: info, setLineInfo }}>
      {children}
    </LineContext.Provider>
  );
};

// Custom hook for easy usage
export const useLineInfo = () => useContext(LineContext);
