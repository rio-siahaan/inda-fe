"use client"

import React, { createContext, useContext, useEffect, useState } from "react";

const DarkModeContext = createContext<any>(null);

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

export const useDarkMode = () => useContext(DarkModeContext);
