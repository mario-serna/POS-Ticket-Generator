import React from "react";

export const TabsContext = React.createContext();

export const TabsContextProvider = ({ children }) => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <TabsContext.Provider value={{ value, handleChange }}>
      {children}
    </TabsContext.Provider>
  );
};

export const useTabsContext = () => {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error("useTabsContext must be used within a TabsContextProvider");
  }
  return context;
};
