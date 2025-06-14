import React from "react";
import { SortIcon } from "./SortIcon";

interface SortButtonProps {
  onClick?: () => void;
  children?: React.ReactNode;
}

const SortButton: React.FC<SortButtonProps> = ({ onClick, children }) => (
  <button
    type="button"
    className="flex items-center gap-1 cursor-pointer hover:text-blue-600 transition-colors"
    onClick={onClick}
  >
    {children}
    <SortIcon />
  </button>
);

export default SortButton;
