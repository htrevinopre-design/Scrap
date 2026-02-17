import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import initialInventory, { inventoryNextId } from '../data/mockInventory';
import mockTransactions from '../data/mockTransactions';
import mockBuyers from '../data/mockBuyers';
import { scoreBuyers } from '../utils/buyerScoring';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [inventory, setInventory] = useState(initialInventory);
  const [transactions, setTransactions] = useState(mockTransactions);
  const [nextInvId, setNextInvId] = useState(inventoryNextId);

  const scoredBuyers = useMemo(() => scoreBuyers(mockBuyers), []);

  const addInventoryItem = useCallback((entry) => {
    setInventory((prev) => [...prev, { id: nextInvId, ...entry }]);
    setNextInvId((prev) => prev + 1);
  }, [nextInvId]);

  const addTransaction = useCallback((txn) => {
    const id = `txn-${String(transactions.length + 1).padStart(3, '0')}`;
    setTransactions((prev) => [{ id, ...txn }, ...prev]);
  }, [transactions.length]);

  const registerSale = useCallback((sale) => {
    addTransaction(sale);
    // Reduce inventory
    setInventory((prev) =>
      prev.map((item) => {
        if (item.id === sale.inventoryItemId) {
          const remaining = item.weightLbs - sale.weightLbs;
          return remaining > 0 ? { ...item, weightLbs: remaining } : null;
        }
        return item;
      }).filter(Boolean)
    );
  }, [addTransaction]);

  return (
    <DataContext.Provider value={{
      inventory,
      transactions,
      scoredBuyers,
      addInventoryItem,
      addTransaction,
      registerSale,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
