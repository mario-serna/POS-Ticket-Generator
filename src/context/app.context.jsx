import React from "react";

const AppContext = React.createContext();

export const AppContextProvider = ({ firebaseAdapter, children }) => {
  return (
    <AppContext.Provider
      value={{
        saveConfigData: firebaseAdapter.saveConfigData,
        getConfigData: firebaseAdapter.getConfigData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = React.useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppContextProvider");
  }
  return context;
};

export default AppContext;
