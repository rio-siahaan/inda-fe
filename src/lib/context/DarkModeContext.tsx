"use client"

import React, { createContext, useContext, useEffect, useState } from "react";

type DarkModeContextType = {
  dark: boolean;
  setDark: React.Dispatch<React.SetStateAction<boolean>>;
};

const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined);

export const DarkModeProvider = ({ children }: { children: React.ReactNode }) => {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const storedDark = localStorage.getItem("darkMode");
    if (storedDark !== null) {
      setDark(storedDark === "true");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", dark.toString());
  }, [dark]);

  return (
    <DarkModeContext.Provider value={{ dark, setDark }}>
      {children}
    </DarkModeContext.Provider>
  );
};

export const useDarkMode = (): DarkModeContextType => {
  const context = useContext(DarkModeContext);
  if (context === undefined) {
    throw new Error("useDarkMode must be used within a <DarkModeProvider>");
  }
  return context;
};