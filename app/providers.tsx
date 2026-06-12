"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Category, Transaction, TransactionContextValue } from "@/lib/types";
import { categoryColor, defaultCategories, defaultTransactions } from "@/lib/utils";

const TransactionContext = createContext<TransactionContextValue | null>(null);
const STORAGE_KEY = "finance-dashboard-state";

function loadStoredState() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as { transactions: Transaction[]; categories: Category[] };
  } catch {
    return null;
  }
}

function saveStoredState(state: { transactions: Transaction[]; categories: Category[] }) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function useTransactionContext() {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error("useTransactionContext must be used within TransactionProvider");
  }
  return context;
}

export function TransactionProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(defaultTransactions);
  const [categories, setCategories] = useState<Category[]>(defaultCategories);

  useEffect(() => {
    const stored = loadStoredState();
    if (stored?.transactions && stored?.categories) {
      setTransactions(stored.transactions);
      setCategories(stored.categories);
    }
  }, []);

  useEffect(() => {
    if (transactions.length === 0 || categories.length === 0) return;
    saveStoredState({ transactions, categories });
  }, [transactions, categories]);

  const addTransaction = (transaction: Omit<Transaction, "id">) => {
    setTransactions((current) => [
      {
        ...transaction,
        id: `txn-${Date.now()}-${Math.random().toString(16).slice(2)}`
      },
      ...current
    ]);
  };

  const updateTransaction = (transaction: Transaction) => {
    setTransactions((current) => current.map((item) => (item.id === transaction.id ? transaction : item)));
  };

  const deleteTransaction = (id: string) => {
    setTransactions((current) => current.filter((item) => item.id !== id));
  };

  const addCategory = (name: string) => {
    const normalized = name.trim();
    if (!normalized) return;
    setCategories((current) => {
      const exists = current.some((item) => item.name.toLowerCase() === normalized.toLowerCase());
      if (exists) return current;
      return [
        {
          id: `cat-${Date.now()}-${Math.random().toString(16).slice(2)}`,
          name: normalized,
          color: categoryColor(normalized)
        },
        ...current
      ];
    });
  };

  const updateCategory = (id: string, name: string) => {
    const normalized = name.trim();
    if (!normalized) return;
    setCategories((current) => {
      const exists = current.some((item) => item.name.toLowerCase() === normalized.toLowerCase() && item.id !== id);
      if (exists) return current;
      return current.map((category) => (category.id === id ? { ...category, name: normalized } : category));
    });

    setTransactions((current) => {
      const categoryToUpdate = categories.find((category) => category.id === id);
      if (!categoryToUpdate) return current;
      const oldName = categoryToUpdate.name;
      if (oldName === normalized) return current;
      return current.map((transaction) =>
        transaction.category === oldName ? { ...transaction, category: normalized } : transaction
      );
    });
  };

  const deleteCategory = (id: string) => {
    setCategories((current) => current.filter((category) => category.id !== id));
  };

  const balance = useMemo(
    () =>
      transactions.reduce((total, transaction) => {
        return transaction.type === "income" ? total + transaction.amount : total - transaction.amount;
      }, 0),
    [transactions]
  );

  const value = useMemo(
    () => ({
      transactions,
      categories,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      addCategory,
      updateCategory,
      deleteCategory,
      balance
    }),
    [transactions, categories, balance]
  );

  return <TransactionContext.Provider value={value}>{children}</TransactionContext.Provider>;
}
