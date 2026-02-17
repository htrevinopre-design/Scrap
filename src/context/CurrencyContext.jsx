import { createContext, useContext, useState } from 'react';

const CurrencyContext = createContext();
const EXCHANGE_RATE = 17.5;

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState('USD');

  const toggleCurrency = () => setCurrency((p) => (p === 'USD' ? 'MXN' : 'USD'));
  const convert = (usdValue) => (currency === 'MXN' ? usdValue * EXCHANGE_RATE : usdValue);

  return (
    <CurrencyContext.Provider value={{ currency, toggleCurrency, convert, exchangeRate: EXCHANGE_RATE }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
