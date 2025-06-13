import React, { createContext, useState, useContext } from "react";

const CoverColorContext = createContext();

export const CoverColorProvider = ({ children }) => {
  const [coverColor, setCoverColor] = useState("#15719e"); // 초기값: 기존 Gradation 색상

  return (
    <CoverColorContext.Provider value={{ coverColor, setCoverColor }}>
      {children}
    </CoverColorContext.Provider>
  );
};

export const useCoverColor = () => useContext(CoverColorContext);
