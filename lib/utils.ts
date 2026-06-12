import { Category, Transaction } from "./types";

export const defaultCategories: Category[] = [
  { id: "salary", name: "Salary", color: "#2f80ed" },
  { id: "food", name: "Food", color: "#f2994a" },
  { id: "utilities", name: "Utilities", color: "#27ae60" },
  { id: "transportation", name: "Transportation", color: "#9b51e0" },
  { id: "extras", name: "Extras", color: "#eb5757" }
];

export const defaultTransactions: Transaction[] = [
  {
    id: "txn-1",
    amount: 4200,
    type: "income",
    category: "Salary",
    date: new Date().toISOString().slice(0, 10)
  },
  {
    id: "txn-2",
    amount: 120,
    type: "expense",
    category: "Food",
    date: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString().slice(0, 10)
  },
  {
    id: "txn-3",
    amount: 85,
    type: "expense",
    category: "Transportation",
    date: new Date(new Date().setDate(new Date().getDate() - 6)).toISOString().slice(0, 10)
  }
];

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);

export const formatDate = (value: string) => {
  const date = new Date(value);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(date);
};

export const monthLabel = (value: string) => {
  const date = new Date(value);
  return new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(date);
};

export const monthKey = (value: string) => {
  const date = new Date(value);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
};

export const categoryColor = (name: string) => {
  const palette = ["#2f80ed", "#f2994a", "#27ae60", "#9b51e0", "#eb5757", "#56ccf2", "#6fcf97", "#7400b8"];
  const index = name
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0) % palette.length;
  return palette[index];
};

export const sortDescending = (items: Transaction[]) =>
  [...items].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
