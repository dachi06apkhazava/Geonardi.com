import React, { createContext, useContext } from 'react';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const baseUrl = 'http://localhost:1337';

  return (
    <DataContext.Provider value={{ baseUrl }}>
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = () => useContext(DataContext);
