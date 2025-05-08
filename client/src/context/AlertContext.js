import React, { createContext, useState } from 'react';

export const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);
  
  // Додавання нового повідомлення
  const addAlert = (msg, type = 'info') => {
    const id = Math.random();
    const newAlert = { id, msg, type };
    setAlerts(alerts => [...alerts, newAlert]);
    
    // Автоматичне видалення повідомлення через 5 секунд
    setTimeout(() => removeAlert(id), 5000);
    
    return id;
  };
  
  // Видалення повідомлення
  const removeAlert = (id) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  return (
    <AlertContext.Provider
      value={{
        alerts,
        addAlert,
        removeAlert
      }}
    >
      {children}
    </AlertContext.Provider>
  );
};