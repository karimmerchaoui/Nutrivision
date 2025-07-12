// store/userContext.js
import React, { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { name, email, mobile, healthConditions }
  const [history, setHistory] = useState([]); // ⬅️ New: food history
  
  // Add consumed food to history
  const addToHistory = (foodItem) => {
    setHistory((prev) => [
      ...prev,
      {
        ...foodItem,
        consumedAt: new Date().toISOString(), // timestamp
      },
    ]);
  };

  // Remove food item by name (optional)
  const removeFromHistory = (foodName) => {
    setHistory((prev) => prev.filter((item) => item.className !== foodName));
  };

  return (
    <UserContext.Provider
      value={{ user, setUser, history, addToHistory, removeFromHistory }}
    >
      {children}
    </UserContext.Provider>
  );
};
