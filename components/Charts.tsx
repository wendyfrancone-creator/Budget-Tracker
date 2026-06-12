"use client";

import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  ChartOptions,
  Legend,
  LinearScale,
  Tooltip
} from "chart.js";
import { Transaction, Category } from "@/lib/types";
import { categoryColor, monthKey } from "@/lib/utils";

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

interface ChartsProps {
  transactions: Transaction[];
  categories: Category[];
}

export function Charts({ transactions, categories }: ChartsProps) {
  const categoriesMap = new Map(categories.map((category) => [category.name, category]));

  const categoryTotals = transactions.reduce<Record<string, number>>((acc, transaction) => {
    acc[transaction.category] = (acc[transaction.category] ?? 0) + transaction.amount;
    return acc;
  }, {});

  const monthGroups = transactions.reduce<Record<string, { income: number; expense: number }>>((acc, transaction) => {
    const month = monthKey(transaction.date);
    if (!acc[month]) acc[month] = { income: 0, expense: 0 };
    if (transaction.type === "income") acc[month].income += transaction.amount;
    else acc[month].expense += transaction.amount;
    return acc;
  }, {});

  const sortedMonths = Object.keys(monthGroups).sort();
  const barData = {
    labels: sortedMonths,
    datasets: [
      {
        label: "Income",
        data: sortedMonths.map((month) => monthGroups[month].income),
        backgroundColor: "#2f80ed"
      },
      {
        label: "Expense",
        data: sortedMonths.map((month) => monthGroups[month].expense),
        backgroundColor: "#eb5757"
      }
    ]
  };

  const pieData = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        data: Object.values(categoryTotals),
        backgroundColor: Object.keys(categoryTotals).map((name) => categoriesMap.get(name)?.color ?? categoryColor(name))
      }
    ]
  };

  const barOptions: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
      legend: { position: "top" }
    }
  };

  const pieOptions: ChartOptions<"pie"> = {
    responsive: true,
    plugins: {
      legend: { position: "bottom" }
    }
  };

  return (
    <div className="grid-2" style={{ gap: "32px" }}>
      <div className="card" style={{ minHeight: "420px" }}>
        <h2>Monthly income vs. expense</h2>
        <Bar options={barOptions} data={barData} />
      </div>
      <div className="card" style={{ minHeight: "420px" }}>
        <h2>Category breakdown</h2>
        <Pie options={pieOptions} data={pieData} />
      </div>
    </div>
  );
}
