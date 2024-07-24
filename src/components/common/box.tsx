"use client";

import React from "react";

const Box = ({
  value,
  onBoxClick,
  isXNext,
}: {
  value?: "X" | "O" | null;
  onBoxClick?: () => void;
  isXNext: boolean;
}) => {
  return (
    <div
      className={`w-[80px] h-[80px] border-4 border-slate-300 flex justify-center items-center cursor-pointer transition-colors duration-200 ${
        isXNext ? "hover:bg-blue-100" : "hover:bg-green-100"
      }`}
      onClick={onBoxClick}
    >
      <div className="text-center text-2xl font-bold text-slate-50">
        {value}
      </div>
    </div>
  );
};

export default Box;
